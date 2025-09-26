
import React from 'react';
import { BoxIcon } from '../icons';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="bg-slate-800/50 backdrop-blur-sm p-4 border-b border-slate-700 sticky top-0 z-10">
            <div className="flex items-center space-x-3">
                <div className="bg-violet-600 p-2 rounded-lg">
                    <BoxIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-wide">{title}</h1>
                    {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
                </div>
            </div>
        </header>
    );
};
