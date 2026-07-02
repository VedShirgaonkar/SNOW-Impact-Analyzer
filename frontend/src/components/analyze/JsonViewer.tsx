import { useState } from "react";
import { Collapsible } from "../common/Collapsible.js";
import "./JsonViewer.css";
export function JsonViewer({ data }: { data: unknown }) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(jsonString);
    } catch {
      const t = document.createElement("textarea");
      t.value = jsonString;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Collapsible title="{ }  Raw JSON">
      <div className="json-viewer">
        <div className="json-toolbar">
          <span className="json-size">
            {(jsonString.length / 1024).toFixed(1)} KB
          </span>
          <button className="copy-button" onClick={handleCopy}>
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
        </div>
        <pre className="json-content">{jsonString}</pre>
      </div>
    </Collapsible>
  );
}
