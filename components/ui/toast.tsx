import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  isVisible: boolean;
}

export const Toast = ({ message, type = 'info', onClose, isVisible }: ToastProps) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}>
            <span>{message}</span>
            <button
              onClick={onClose}
              className="ml-4 hover:opacity-75"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};