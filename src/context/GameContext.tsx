
"use strict";
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameState {
    userName: string;
    userEmail: string;
    userPhoto: string | null; // base64
    score: number;
    completed: boolean;
    setUserName: (name: string) => void;
    setUserEmail: (email: string) => void;
    setUserPhoto: (photo: string | null) => void;
    setScore: (score: number) => void;
    setCompleted: (completed: boolean) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    return (
        <GameContext.Provider value={{
            userName,
            userEmail,
            userPhoto,
            score,
            completed,
            setUserName,
            setUserEmail,
            setUserPhoto,
            setScore,
            setCompleted
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
