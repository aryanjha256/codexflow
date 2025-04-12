// src/components/MermaidViewer.tsx
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false });

interface MermaidViewerProps {
  chart: string;
}

export default function MermaidViewer({ chart }: MermaidViewerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      if (ref.current) {
        ref.current.innerHTML = ""; // 🔄 Clear previous renders

        // 🧱 Create a temporary ID (unique each time)
        const id = "mermaid-chart-" + Math.floor(Math.random() * 10000);

        const el = document.createElement("div");
        el.className = "mermaid";
        el.id = id;
        el.textContent = chart;

        ref.current.appendChild(el);

        try {
          await mermaid.run({ nodes: [el] });
        } catch (err) {
          console.error("Mermaid render error:", err);
        }
      }
    };

    renderMermaid();
  }, [chart]);

  return (
    <div ref={ref} className="overflow-x-auto p-4 bg-white rounded shadow" />
  );
}
