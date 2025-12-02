import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (text: string) => Promise<void>;
  columnTitle: string;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onImport, columnTitle }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await onImport(text);
      setText('');
      onClose();
    } catch (error) {
      alert("Failed to generate tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-lg rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
        
        <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={18} />
            <h3 className="font-semibold text-slate-100">Magic Import to "{columnTitle}"</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
            <p className="text-sm text-slate-400 mb-3">
                Paste your meeting notes, brain dump, or list of items here. 
                AI will automatically convert them into individual tickets.
            </p>
            <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 bg-slate-900/50 rounded-lg border border-slate-700 p-4 text-slate-300 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none custom-scrollbar"
                placeholder="- Fix the login bug on safari&#10;- Update the landing page hero image&#10;- Research new DB architecture..."
                autoFocus
            />
        </div>

        <div className="p-4 border-t border-white/5 bg-slate-900/50 flex justify-end gap-3">
             <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
             >
                 Cancel
             </button>
             <button 
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                className="px-4 py-2 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
             >
                 {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                 {loading ? 'Generating...' : 'Generate Tasks'}
             </button>
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;