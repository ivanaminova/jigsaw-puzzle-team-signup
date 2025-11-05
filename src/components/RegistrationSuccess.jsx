import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Puzzle } from 'lucide-react';

const COLORS = [
  '#FBBF24',
  '#34D399',
  '#60A5FA',
  '#F472B6',
  '#A78BFA',
];

const NUM_PIECES = 25; 
const ANIMATION_DURATION = 8; 

const generatePieceProperties = (width, height) => ({
  id: Math.random(),
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  size: Math.random() * 20 + 25, 
  
  initialX: Math.random() * width,
  initialY: Math.random() * height,

  targetX: (Math.random() - 0.5) * width * 1.5,
  targetY: (Math.random() - 0.5) * height * 1.5,
  
  rotateTo: Math.random() * 720 + 360,
  
  duration: ANIMATION_DURATION + (Math.random() * 4 - 2), 
  delay: Math.random() * 2, 
});

const PuzzlePiece = ({ piece }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: piece.initialX,
        top: piece.initialY,
        pointerEvents: 'none',
        opacity: 1, 
        zIndex: 5,
      }}
      initial={{ 
        x: 0, 
        y: 0, 
        rotate: 0, 
        scale: 1, 
        opacity: 0,
      }}
      animate={{
        x: piece.targetX,
        y: piece.targetY,
        rotate: piece.rotateTo,
        scale: [1, 1.2, 1], 
        opacity: [0.2, 0.8, 1, 0.7, 0.5], 
      }}
      transition={{
        duration: piece.duration,
        delay: piece.delay,
        ease: "linear",
        repeat: Infinity, 
        repeatType: "reverse", 
      }}
    >
      <Puzzle size={piece.size} color={piece.color} fill={piece.color} />
    </motion.div>
  );
};

const PuzzleAnimationLayer = () => {
  const puzzlePieces = useMemo(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 800;
    const height = typeof window !== 'undefined' ? window.innerHeight : 600;
    return Array.from({ length: NUM_PIECES }, () => generatePieceProperties(width, height));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-transparent">
      {puzzlePieces.map((piece) => (
        <PuzzlePiece key={piece.id} piece={piece} />
      ))}
    </div>
  );
};

function RegistrationSuccess() {
  return (
    <>
      <PuzzleAnimationLayer /> 

      <div className="relative z-10 w-full h-full flex flex-col items-center font-bold mt-20 text-white">
        <h1 className="text-2xl mb-4">Thank you for registering for the event!</h1>
        <h1 className="text-4xl">See you there!</h1>
      </div>
    </>
  );
}

export default RegistrationSuccess;
