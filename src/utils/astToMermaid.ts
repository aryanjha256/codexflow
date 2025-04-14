import { Program } from "esprima";
import { Expression, PrivateIdentifier, Super } from "estree";

export interface FlowNode {
  id: string;
  label: string;
  type: "start" | "decision" | "operation" | "end";
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface FlowGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
  executionPath?: string[]; // IDs of nodes that are executed
}

let nodeId = 0;

function getId() {
  return `node${nodeId++}`;
}

export function resetMermaidCounter() {
  nodeId = 0;
}

export function astToMermaid(ast: Program): string {
  if (!ast || !ast.body || !Array.isArray(ast.body)) return "";

  const lines: string[] = ["graph TD"];

  const walk = (node: (typeof ast.body)[0], parentId?: string): string => {
    const id = getId();

    switch (node.type) {
      case "FunctionDeclaration": {
        const funcId = `${id}["Function: ${node.id.name}"]`;
        lines.push(funcId);

        node.body.body.forEach((stmt: (typeof node.body.body)[0]) => {
          const childId = walk(stmt, id);
          lines.push(`${id} --> ${childId}`);
        });

        return id;
      }

      case "IfStatement": {
        const test = `${id}{"if (${generateCode(node.test)})"}`;
        lines.push(test);

        const consequentId = walk(node.consequent);
        lines.push(`${id} -->|true| ${consequentId}`);

        if (node.alternate) {
          const altId = walk(node.alternate);
          lines.push(`${id} -->|false| ${altId}`);
        }

        return id;
      }

      case "ReturnStatement": {
        const returnId = `${id}["return ${generateCode(node.argument)}"]`;
        lines.push(returnId);
        return id;
      }

      case "ExpressionStatement": {
        const exprId = `${id}["${generateCode(node.expression)}"]`;
        lines.push(exprId);
        return id;
      }

      case "WhileStatement": {
        const whileId = `${id}{"while (${generateCode(node.test)})"}`;
        lines.push(whileId);

        const bodyId = walk(node.body);
        lines.push(`${id} -->|true| ${bodyId}`);
        lines.push(`${bodyId} --> ${id}`); // Loop back
        lines.push(`${id} -->|false| ${getId()}["End while"]`);

        return id;
      }

      case "BlockStatement": {
        let prevId = id;
        node.body.forEach((stmt: (typeof node.body)[0], i: number) => {
          const stmtId = walk(stmt, prevId);
          if (i === 0 && parentId) {
            lines.push(`${parentId} --> ${stmtId}`);
          } else {
            lines.push(`${prevId} --> ${stmtId}`);
          }
          prevId = stmtId;
        });
        return id;
      }

      default: {
        const defaultId = `${id}["${node.type}"]`;
        lines.push(defaultId);
        return id;
      }
    }
  };

  ast.body.forEach((node: (typeof ast.body)[0]) => walk(node));

  return lines.join("\n");
}

function generateCode(
  node: Expression | PrivateIdentifier | Super | null | undefined
): string {
  try {
    return node?.type === "Literal"
      ? JSON.stringify(node.value)
      : node?.type === "Identifier"
      ? node.name
      : node?.type === "BinaryExpression"
      ? `${generateCode(node.left)} ${node.operator} ${generateCode(
          node.right
        )}`
      : node?.type === "CallExpression"
      ? `${generateCode(node.callee)}(...)`
      : node?.type === "MemberExpression"
      ? `${generateCode(node.object)}.${generateCode(node.property)}`
      : node?.type === "UnaryExpression"
      ? `${node.operator}${generateCode(node.argument)}`
      : "???";
  } catch {
    return "???";
  }
}
