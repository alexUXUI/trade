import { motion } from 'framer-motion';

export const AnimatedLogo = () => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      className="w-26 h-26 max-w-full"
    >
      <defs>
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>

      <motion.rect
        width="32"
        height="32"
        rx="8"
        fill="#1E293B"
        initial={{ opacity: 0, scale: 1 }}
        animate={{}}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M8 16L13 11L18 16L24 10"
        stroke="url(#lineGradient1)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.path
        d="M8 21L13 16L18 21L24 15"
        stroke="url(#lineGradient2)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </motion.svg>
  );
};