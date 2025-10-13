import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ message }) => (
  <div className="max-w-3xl mx-auto mb-12">
    <div className="bg-red-950/30 backdrop-blur-xl border border-red-800/30 rounded-2xl p-5 flex items-start gap-4">
      <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-red-300 mb-1">Error</h3>
        <p className="text-red-200/80 text-sm">{message}</p>
      </div>
    </div>
  </div>
);
export default ErrorAlert;