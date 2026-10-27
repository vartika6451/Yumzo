'use client';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';

const ClientToast = () => {
  const toastMessage = useCartStore((state) => state.toastMessage);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm tracking-wide border border-gray-700 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientToast;
