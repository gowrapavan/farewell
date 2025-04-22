import { useState, useEffect, useRef } from 'react';
import { MemoryQuote } from '../types';
import MemorySlide from './MemorySlide';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface MemoriesContainerProps {
  memories: MemoryQuote[];
}

const MemoriesContainer: React.FC<MemoriesContainerProps> = ({ memories }) => {
  const [loaded, setLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { ref } = useInView({
    threshold: 0.8,
    triggerOnce: true,
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.muted = isMuted;

    const setupAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
    };

    const handleFocus = () => {
      audio.play().catch(console.error);
    };

    const handleBlur = () => {
      audio.pause();
    };

    const handleEnded = () => {
      if (!document.hidden) {
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplaythrough', setupAudio);

    if (audio.readyState >= 3) {
      setupAudio();
    } else {
      const fallbackPlay = () => {
        setupAudio();
        audio.removeEventListener('loadeddata', fallbackPlay);
      };
      audio.addEventListener('loadeddata', fallbackPlay);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplaythrough', setupAudio);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isMuted]);

  return (
    <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar">
      <audio
        ref={audioRef}
        src="yes.mp3"
        loop
        preload="auto"
        playsInline
        muted={isMuted}
        className="hidden"
      />

      {/* Intro Slide */}
      <div className="w-full h-screen snap-start flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>

        <motion.div 
          ref={ref}
          className="z-10 text-center max-w-4xl px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: loaded ? 1 : 0, rotate: loaded ? 0 : -180 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <Sparkles size={56} className="text-yellow-300" />
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            Memories of <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400">218X1A12...</span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-white/80 mb-10 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            A digital tribute to our graduating batch
          </motion.p>

          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            <p className="text-white/70">Scroll down for message</p>
            <motion.div 
              className="mt-4 animate-bounce"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mx-auto text-white/60"
              >
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Slides */}
      {memories.map((memory, index) => (
        <MemorySlide 
          key={memory.rollno} 
          memory={memory} 
          index={index} 
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
        />
      ))}

      {/* Final Slide */}
      <div className="w-full h-screen snap-start flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-950 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=1260')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>

        <motion.div 
          className="z-10 text-center max-w-4xl px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-8">Thank You for the Memories</h1>
          <p className="text-xl text-white/80 mb-10">
            Though our paths may diverge, the memories we've created will forever bind our hearts together.
          </p>
          <div className="mt-8 flex justify-center">
            <Sparkles size={32} className="text-yellow-300 mr-2" />
            <span className="text-lg font-light">Batch of 2021 - 2025</span>
            <Sparkles size={32} className="text-yellow-300 ml-2" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MemoriesContainer;
