import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blobVariants } from './blobVariants';

const AmoebaOccasionCard = ({ occasion, index = 0 }) => {
  const blob = blobVariants[index % blobVariants.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/products?category=${occasion.slug}`} className="block">
        <div className="relative mx-auto w-full">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
            className={`absolute -inset-2 bg-gradient-to-br from-purple-200/90 via-pink-100/80 to-violet-200/70 blur-md sm:-inset-3 ${blob.glow} ${blob.rotate} transition-transform duration-700 ${blob.hoverRotate}`}
          />

          <div
            className={`relative overflow-hidden bg-white p-2 shadow-lg transition-all duration-500 sm:p-2.5 ${blob.frame} ${blob.rotate} group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-purple-200/50 ${blob.hoverRotate}`}
          >
            <div className={`relative overflow-hidden ${blob.image}`}>
              <img
                src={occasion.image}
                alt={occasion.name}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${occasion.color} opacity-25 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-35`} />
            </div>
          </div>
        </div>

        <div className="mt-4 text-center px-1">
          <span className="text-xl sm:text-2xl" aria-hidden="true">
            {occasion.emoji}
          </span>
          <h3 className="mt-1.5 text-sm font-semibold leading-snug text-[#2d2a45] transition-colors group-hover:text-[#673ab7] sm:text-[15px]">
            {occasion.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default AmoebaOccasionCard;
