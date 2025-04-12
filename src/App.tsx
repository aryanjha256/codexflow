import { useState } from "react";
import * as esprima from "esprima";
import MermaidViewer from "./components/MermaidViewer";
import { astToMermaid, resetMermaidCounter } from "./utils/astToMermaid";
import CodeEditor from "./components/CodeEditor";

function App() {
  const [code, setCode] = useState("");
  const [diagram, setDiagram] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVisualize = () => {
    setError(null);
    try {
      const ast = esprima.parseScript(code);
      console.log(ast);
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

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Code X Flow</h1>
      <CodeEditor code={code} onChange={setCode} />
      <button
        onClick={handleVisualize}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Visualize
      </button>

      {error && <div className="text-red-500">{error}</div>}
      {diagram && <MermaidViewer chart={diagram} />}
    </div>
  );
}

export default App;
