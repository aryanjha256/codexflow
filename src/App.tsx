import { useState } from "react";
import * as esprima from "esprima";
import MermaidViewer from "./components/MermaidViewer";
import { astToMermaid, resetMermaidCounter } from "./utils/astToMermaid";

function App() {
  const [code, setCode] = useState("");
  const [diagram, setDiagram] = useState<string | null>(null);

  const handleVisualize = () => {
    try {
      const ast = esprima.parseScript(code);
      resetMermaidCounter();
      const chart = astToMermaid(ast);
      console.log(chart);
      setDiagram(chart);
    } catch (err) {
      console.error(err);
      setDiagram(null);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Code Flow Visualizer</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste JS function here"
        className="w-full h-40 p-2 border font-mono rounded"
      />
      <button
        onClick={handleVisualize}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Visualize
      </button>

      {diagram && <MermaidViewer chart={diagram} />}
    </div>
  );
}

export default App;
