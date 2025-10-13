import { Folder, FileCode } from 'lucide-react';

const SelectedNodeInfo = ({ selectedNode, getFileColor }) => {
  if (!selectedNode) return null;

  return (
    <div className="max-w-7xl mx-auto mb-6">
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-4 border border-slate-800/50">
        <div className="flex items-center gap-3">
          {selectedNode.type === 'dir' ? (
            <Folder className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
          ) : (
            <FileCode
              className="w-5 h-5"
              style={{ color: getFileColor(selectedNode.name) }}
              strokeWidth={1.5}
            />
          )}
          <div className="flex-1">
            <p className="font-mono text-sm text-slate-300">
              {selectedNode.fullPath || selectedNode.name}
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-800/50 rounded-lg text-xs font-medium text-slate-400">
            {selectedNode.type === 'dir' ? 'Directory' : 'File'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectedNodeInfo;
