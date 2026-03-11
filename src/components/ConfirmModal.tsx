"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'info';
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmer", type = "danger" }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${type === 'danger' ? 'bg-red-100' : 'bg-blue-100'}`}>
              <AlertTriangle className={`w-7 h-7 ${type === 'danger' ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 mb-8">{message}</p>
            
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button 
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all shadow-lg ${
                  type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-[#001f5f] hover:bg-[#001a4d] shadow-blue-200'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
