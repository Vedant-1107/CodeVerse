import { Search, Loader } from 'lucide-react';

const RepoInput = ({ repoUrl, setRepoUrl, handleFetchRepo, loading }) => (
  <div className="max-w-3xl mx-auto mb-12">
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-800/50">
      <div className="flex gap-3">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFetchRepo()}
            placeholder="https://github.com/username/repository"
            className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-slate-200 placeholder-slate-500 transition-all"
          />
        </div>
        <button
          onClick={handleFetchRepo}
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-slate-700 disabled:to-slate-700 rounded-xl font-medium text-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Loading</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Visualize</span>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);
export default RepoInput;