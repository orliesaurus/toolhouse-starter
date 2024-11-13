import { motion } from 'framer-motion';
import Link from 'next/link';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <strong className="prose lg:prose-xl">Welcome to the Playground</strong>
        <p>
          This is an interactive environment where you can test Toolhouse with the tools you installed.
          You can use the Playground to test out a tool, or to see how multiple tools work together.
        </p>
      </div>
    </motion.div>
  );
};
