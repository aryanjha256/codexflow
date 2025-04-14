import { useState } from "react";
import * as esprima from "esprima";
import MermaidViewer from "./components/MermaidViewer";
import { astToMermaid, resetMermaidCounter } from "./utils/astToMermaid";
import CodeEditor from "./components/CodeEditor";
import Drawer from "./components/Drawer";

function App() {
  const [code, setCode] = useState("");
  const [diagram, setDiagram] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [ast, setAst] = useState<esprima.Program | null>(null);

  const handleVisualize = () => {
    setError(null);
    setDiagram(null);
    try {
      handleParse();
      const ast = esprima.parseScript(code);
      resetMermaidCounter();
      const chart = astToMermaid(ast);
      console.log(chart);
      setDiagram(chart);
    } catch (err) {
      console.error(err);
      setDiagram(null);
      setError(String(err ?? "Unknown error"));
    }
  };

  const handleParse = () => {
    setAst(null);
    try {
      const parsed = esprima.parseScript(code, { loc: true });
      setAst(parsed);
    } catch (e) {
      console.error("Parsing error:", e);
      setAst(null);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Code X Flow</h1>
      <CodeEditor code={code} onChange={setCode} />
      <button
        type="button"
        onClick={handleVisualize}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Visualize
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-orange-300 text-white px-4 py-2 rounded cursor-pointer ml-2"
      >
        View AST
      </button>

      {error && <div className="text-red-500">{error}</div>}
      {diagram && <MermaidViewer chart={diagram} />}
      <Drawer isOpen={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Parsed AST</h2>
        {ast && (
          <pre className="mt-4 p-4 bg-gray-800 max-h-[90%] rounded overflow-scroll text-sm">
            {JSON.stringify(ast, null, 2)}
          </pre>
        )}
      </Drawer>
    </div>
  );
}

export default App;
