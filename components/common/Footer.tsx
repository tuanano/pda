
import React from 'react';
import { HomeIcon, SettingsIcon } from '../icons';

interface FooterProps {
    onHomeClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onHomeClick }) => {
    return (
        <footer className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 p-2 mt-auto">
            <div className="flex justify-around items-center">
                <button onClick={onHomeClick} className="flex flex-col items-center text-violet-400 p-2 rounded-lg w-24">
                    <HomeIcon className="w-7 h-7" />
                    <span className="text-xs mt-1">Home</span>
                </button>
                <button className="flex flex-col items-center text-slate-500 p-2 rounded-lg w-24">
                    <SettingsIcon className="w-7 h-7" />
                    <span className="text-xs mt-1">Settings</span>
                </button>
            </div>
        </footer>
    );
};
