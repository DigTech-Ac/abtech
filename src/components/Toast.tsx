"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/store/toast";

export default function Toast() {
  const { message, type, isVisible, hideToast } = useToastStore();

  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const current = styles[type];

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className={`fixed top-24 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg ${current.bg} ${current.border} min-w-[300px] max-w-md`}
        >
          <div className="flex-shrink-0">{current.icon}</div>
          <p className={`flex-1 text-sm font-medium ${current.text}`}>
            {message}
          </p>
          <button 
            onClick={hideToast}
            className="p-1 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
          
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
            className={`absolute bottom-0 left-0 h-1 rounded-b-2xl ${
              type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
