// components/CodeEditor.tsx
import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  onChange: (val: string) => void;
};

export default function CodeEditor({ code, onChange }: Props) {
  return (
    <div className="w-full h-[500px] border rounded-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
