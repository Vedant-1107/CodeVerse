// components/FilePreview.jsx
import React, { useEffect } from "react";

const FilePreview = ({ filePreview, setFilePreview, repoData, fetchFileContent }) => {
  const { content, visible, x, y, expanded, path } = filePreview;

  useEffect(() => {
    if (visible && repoData && path && content === "Loading preview...") {
      fetchFileContent(repoData.owner, repoData.repo_name, path, x, y, expanded);
    }
  }, [visible, path, expanded]);

  if (!visible) return null;

  const displayContent = expanded
    ? content
    : content.split("\n").slice(0, 20).join("\n");

  return (
    <div
      className={`fixed z-50 bg-slate-900 text-gray-200 border border-gray-700 rounded-lg shadow-xl transition-all duration-200 ${
        expanded ? "p-4 w-[600px] h-[400px] overflow-auto" : "p-3 w-[400px] max-h-[250px] overflow-hidden"
      }`}
      style={{
        left: `${x + 30}px`,
        top: `${y + 30}px`,
      }}
    >
      <div className="font-semibold text-indigo-400 mb-2 text-sm">{path}</div>
      <pre className="whitespace-pre-wrap text-xs font-mono leading-snug">
        {displayContent}
      </pre>
    </div>
  );
};

export default FilePreview;