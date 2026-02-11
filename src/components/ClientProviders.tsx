
'use client';

import { GameProvider } from '@/context/GameContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <GameProvider>
            {children}
        </GameProvider>
    );
}
