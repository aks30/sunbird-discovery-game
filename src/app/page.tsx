
"use client";

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { ArrowRight, User, MousePointerClick } from 'lucide-react';
import { buildingBlocks, BuildingBlock } from '@/lib/data';

export default function Home() {
  const router = useRouter();
  const { setUserName } = useGame();
  const [name, setName] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Use all blocks for the carousel to show variety
  const infiniteBlocks = [...buildingBlocks, ...buildingBlocks];

  const handleStart = () => {
    setShowInput(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
      router.push('/game');
    }
  };

  return (
    <div className="min-h-screen bg-sunbird-beige text-sunbird-brown overflow-hidden relative font-sans selection:bg-sunbird-orange/20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sunbird-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sunbird-orange/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Navbar / Logo */}
      <nav className="p-6 md:p-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <img src="/assets/sunbird-logo-new.png" alt="Sunbird Logo" className="h-10 md:h-12 w-auto" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 md:py-12 flex flex-col md:flex-row items-center relative z-10 min-h-[calc(100vh-100px)] h-auto">

        {/* Left: Text & CTA */}
        <div className="md:w-1/2 mb-0 md:mb-0 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-sunbird-brown tracking-tight">
              Scale Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbird-orange to-sunbird-yellow">
                Impact
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg font-medium leading-relaxed">
              Sunbird is a digital public good that empowers nations to build population-scale solutions using open-source building blocks.
            </p>

            <div className="min-h-[80px]">
              {!showInput ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="group bg-sunbird-orange hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full flex items-center gap-3 text-lg shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  Start Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="relative flex-grow">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border-2 border-sunbird-brown/10 rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-sunbird-orange text-sunbird-brown placeholder-gray-400 transition-all text-lg shadow-sm"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="bg-sunbird-brown hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    Go
                  </button>
                </form>
              )}
            </div>

            {/* Stats section with increased mobile gap (mt-12) and animated counters */}
            <div className="mt-12 md:mt-16 grid grid-cols-3 gap-8 border-t border-sunbird-brown/10 pt-8">
              <StatCard label="Learners" value={20} suffix="M+" />
              <StatCard label="Learning Assets" value={350} suffix="K+" />
              <StatCard label="Credentials Issued" value={130} suffix="M+" />
            </div>
          </motion.div>
        </div>

        {/* Right: Infinite Carousel */}
        <div className="md:w-1/2 relative flex justify-center w-full h-auto md:h-[600px] items-center pb-[50px] md:pb-0">

          {/* Carousel Window */}
          <div className="w-full md:w-[400px] h-[350px] md:h-[500px] relative">

            {/* Gradients for smooth fade out */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sunbird-beige via-sunbird-beige/80 to-transparent z-20 pointer-events-none md:block hidden" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-sunbird-beige via-sunbird-beige/80 to-transparent z-20 pointer-events-none md:block hidden" />

            <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-sunbird-beige via-sunbird-beige/80 to-transparent z-20 pointer-events-none md:hidden block" />
            <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-sunbird-beige via-sunbird-beige/80 to-transparent z-20 pointer-events-none md:hidden block" />


            {/* Desktop Vertical Scroll */}
            <div className="hidden md:block h-full overflow-hidden relative">
              <motion.div
                className="flex flex-col gap-6 absolute w-full top-0 pb-10"
                animate={{ y: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              >
                {infiniteBlocks.map((block, i) => (
                  <BlockCard key={`v-${i}`} block={block} />
                ))}
              </motion.div>
            </div>

            {/* Mobile Horizontal Scroll */}
            <div className="md:hidden flex items-center h-full w-full overflow-hidden relative">
              <motion.div
                className="flex flex-row gap-4 absolute left-0 pl-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
              >
                {infiniteBlocks.map((block, i) => (
                  <BlockCard key={`h-${i}`} block={block} className="w-[280px] shrink-0" />
                ))}
              </motion.div>
            </div>

            {/* Float label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sunbird-brown/50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <MousePointerClick className="w-4 h-4" />
              Interactive Learning
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const animation = animate(count, value, { duration: 2, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v.toLocaleString()));
    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return <span>{display}{suffix}</span>;
}

function BlockCard({ block, className = '' }: { block: BuildingBlock, className?: string }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-sunbird-brown/10 flex flex-col items-start gap-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="w-12 h-12 relative">
        <img src={block.imageUrl} alt={block.name} className="w-full h-full object-contain" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-sunbird-brown mb-2">{block.name}</h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {block.description}
        </p>
      </div>
    </div>
  )
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-3xl md:text-4xl font-extrabold text-sunbird-brown tracking-tight">
        <Counter value={value} suffix={suffix} />
      </span>
      <span className="text-xs md:text-sm text-gray-500 uppercase tracking-widest mt-2 font-bold">{label}</span>
    </div>
  );
}
