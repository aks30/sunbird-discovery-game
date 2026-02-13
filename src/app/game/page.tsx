
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { buildingBlocks, BuildingBlock } from '@/lib/data';
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragEndEvent,
    useSensor,
    useSensors,
    PointerSensor,
    TouchSensor
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, X } from 'lucide-react';

/* Utility to shuffle array */
function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

function getColor(category: string) {
    if (category === 'Learning') return 'bg-sunbird-yellow';
    if (category === 'AI & Language') return 'bg-purple-500';
    if (category === 'Data') return 'bg-blue-500';
    if (category === 'Trust & Identity') return 'bg-green-500';
    return 'bg-gray-400';
}

/* Draggable Component */
function DraggableBlock({ block }: { block: BuildingBlock }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: block.id,
        data: { block },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Extract simple name (e.g., "Educator" from "Educator (AKA ED)")
    const simpleName = block.name.split(' (')[0];

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`touch-none p-2 bg-white border-2 border-sunbird-brown/10 rounded-xl shadow-sm cursor-grab active:cursor-grabbing flex flex-col items-center justify-center gap-1 w-full aspect-square active:scale-105 transition-all hover:border-sunbird-orange ${isDragging ? 'opacity-50 z-50 ring-4 ring-sunbird-orange scale-110 shadow-xl' : ''}`}
        >
            <div className="w-12 h-12 shrink-0 relative">
                <img src={block.imageUrl} alt={block.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-[8px] font-bold text-center text-sunbird-brown leading-tight overflow-hidden text-ellipsis px-0.5">{simpleName}</span>
        </div>
    );
}

/* Droppable Target */
function DropZone() {
    const { setNodeRef, isOver } = useDroppable({
        id: 'drop-zone',
    });

    return (
        <div
            ref={setNodeRef}
            className={`w-full h-20 border-2 border-dashed rounded-xl flex items-center justify-center transition-colors duration-300 ${isOver ? 'border-sunbird-orange bg-sunbird-orange/10 scale-105' : 'border-sunbird-brown/30 bg-sunbird-brown/5'}`}
        >
            <span className={`text-sm transition-colors ${isOver ? 'text-sunbird-orange' : 'text-sunbird-brown/60'}`}>
                {isOver ? 'Drop Here!' : 'Drag correct block here'}
            </span>
        </div>
    );
}

export default function GamePage() {
    const router = useRouter();
    const { userName, score, setScore, setCompleted } = useGame();

    // Sensors for better touch handling
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor)
    );

    // Game State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState<BuildingBlock[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    // Load questions - randomly select 4 blocks
    const [shuffledBlocks] = useState(() => shuffle(buildingBlocks).slice(0, 4));

    useEffect(() => {
        if (!userName) {
            router.push('/');
        }
    }, [userName, router]);

    // Setup options for current block
    useEffect(() => {
        if (currentIndex < shuffledBlocks.length) {
            const current = shuffledBlocks[currentIndex];
            const otherBlocks = buildingBlocks.filter(b => b.id !== current.id);
            const distractors = shuffle(otherBlocks).slice(0, 3);
            setOptions(shuffle([current, ...distractors]));
        } else {
            // Game Over
            setCompleted(true);
            confetti();
            // Delay to show celebration before moving to certificate
            const timer = setTimeout(() => router.push('/certificate'), 2000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, shuffledBlocks, router, setCompleted]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const currentBlock = shuffledBlocks[currentIndex];

        // Check if dropped on drop-zone
        if (over && over.id === 'drop-zone') {
            if (active.id === currentBlock.id) {
                // Correct
                setFeedback('correct');
                setScore(score + 10);

                // Visual feedback
                confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { y: 0.7 },
                    colors: ['#22c55e', '#ffffff']
                });

                // Move to next
                setTimeout(() => {
                    setFeedback(null);
                    setCurrentIndex(prev => prev + 1);
                }, 800);
            } else {
                // Wrong
                setFeedback('wrong');
                setTimeout(() => setFeedback(null), 800);
            }
        }
    };

    const currentBlock = shuffledBlocks[currentIndex];

    if (!userName || !currentBlock) return null;

    const progress = ((currentIndex) / shuffledBlocks.length) * 100;

    return (
        <div className="min-h-screen bg-sunbird-beige text-sunbird-brown flex flex-col items-center pt-4 px-4 pb-10 safe-area-inset-bottom overflow-y-auto font-sans">

            {/* Header */}
            <div className="w-full max-w-md flex justify-between items-center mb-4 px-2">
                <div className="flex flex-col">
                    <span className="text-sunbird-brown/60 text-xs uppercase tracking-wider font-semibold">Player</span>
                    <span className="font-bold text-lg truncate max-w-[120px] text-sunbird-brown">{userName}</span>
                </div>



                <div className="flex flex-col items-end">
                    <span className="text-sunbird-brown/60 text-xs uppercase tracking-wider font-semibold">Score</span>
                    <span className="font-bold text-xl text-sunbird-orange tabular-nums">{score}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md bg-white h-2 rounded-full mb-4 overflow-hidden relative border border-sunbird-brown/10 shadow-inner">
                <motion.div
                    className="h-full bg-sunbird-yellow rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Game Area */}
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="w-full max-w-md mb-4 relative">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentBlock.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="bg-white border-2 border-sunbird-brown/10 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center gap-4"
                        >
                            <h2 className="text-sm text-sunbird-brown font-medium leading-relaxed">
                                {currentBlock.description}
                            </h2>

                            <div className="w-full">
                                <DropZone />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Feedback Overlay */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                            >
                                {feedback === 'correct' ? (
                                    <div className="bg-green-500 p-6 rounded-full shadow-lg shadow-green-500/50">
                                        <Check className="w-16 h-16 text-white" />
                                    </div>
                                ) : (
                                    <div className="bg-red-500 p-6 rounded-full shadow-lg shadow-red-500/50">
                                        <X className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Draggables */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                    {options.map((block) => (
                        <DraggableBlock key={block.id} block={block} />
                    ))}
                </div>
            </DndContext>
        </div>
    );
}
