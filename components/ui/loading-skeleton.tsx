import { motion } from 'framer-motion';

export const LoadingSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-24 bg-gray-200 rounded-lg"
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="bg-white rounded-lg shadow-lg p-6 space-y-4"
      >
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </motion.div>
    </div>
  );
};