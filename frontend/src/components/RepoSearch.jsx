// components/RepoSearch.jsx
import React from 'react';
import { Search } from 'lucide-react';

const RepoSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className='w-7/12 mx-auto mb-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-slate-800/50 flex items-center gap-4'>
        <Search className="w-7 h-7 text-white" strokeWidth={1.5} />
        <input
        type="text"
        placeholder="Search files or folders..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-5 px-5 py-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-slate-200 placeholder-slate-500 transition-all"
        />
    </div>
  );
};

export default RepoSearch;