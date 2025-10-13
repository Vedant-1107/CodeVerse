import { GitBranch } from 'lucide-react';

const Header = () => (
  <div className="text-center mb-12">
    <div className="flex items-center justify-center gap-4 mb-4">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
        <GitBranch className="relative w-12 h-12 text-indigo-400" strokeWidth={1.5} />
      </div>
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
        CodeVerse
      </h1>
    </div>
    <p className="text-slate-400 text-lg font-light">
      Explore repository structures with an elegant radial tree visualization
    </p>
  </div>
);
export default Header;