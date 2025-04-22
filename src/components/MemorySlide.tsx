import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MemoryQuote } from '../types';
import { defaultImage } from '../data/memoryQuotes';
import Confetti from './animations/Confetti';
import { useInView } from 'react-intersection-observer';
import { Volume2, VolumeX } from 'lucide-react';

interface MemorySlideProps {
  memory: MemoryQuote;
  index: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

const MemorySlide: React.FC<MemorySlideProps> = ({ memory, index, isMuted, onToggleMute }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.6,
    triggerOnce: false,
  });
  
  useEffect(() => {
    if (inView) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [inView]);
  
  const imageToUse = memory.image && !imageError ? memory.image : defaultImage;
  
  const getGradient = (index: number) => {
    const gradients = [
      'from-indigo-800 to-purple-700',
      'from-purple-800 to-pink-700',
      'from-blue-800 to-indigo-700',
      'from-violet-800 to-fuchsia-700',
      'from-indigo-900 to-blue-700',
      'from-purple-900 to-indigo-700',
      'from-pink-800 to-purple-700',
      'from-fuchsia-800 to-pink-700',
    ];
    return gradients[index % gradients.length];
  };
  
  return (
    <div 
      ref={ref}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden snap-start`}
    >
      <Confetti trigger={showConfetti} />
      
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)} z-0`}></div>
      
      <motion.div 
        className="absolute inset-0 opacity-40 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 0.4 : 0 }}
        transition={{ duration: 1 }}
      >
        <img 
          src={imageToUse} 
          alt={memory.name} 
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 z-20"></div>
      
      <motion.div 
        className="absolute top-6 left-6 z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-mono text-xl md:text-2xl text-yellow-300 tracking-wider">
          {memory.rollno}
        </h2>
      </motion.div>

      <motion.div 
        className="absolute bottom-48 left-0 right-0 z-30 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <motion.blockquote 
          className="text-xl md:text-2xl italic font-serif text-white/90 leading-relaxed text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.95 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          "{memory.quote}"
        </motion.blockquote>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 left-0 right-0 z-30 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-12">
          {memory.name}
        </h1>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-40 flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 0.8 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="text-white/70 text-sm font-light">
          Scroll down for next message
        </div>
      </motion.div>

      <motion.button
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-colors duration-300"
        onClick={onToggleMute}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white/90" />
        ) : (
          <Volume2 className="w-6 h-6 text-white/90" />
        )}
      </motion.button>
    </div>
  );
};

export default MemorySlide;
