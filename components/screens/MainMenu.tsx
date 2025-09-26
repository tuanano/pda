
import React from 'react';
import { BoxIcon } from '../icons';

interface MainMenuProps {
    onNavigate: () => void;
}

const MenuButton: React.FC<{ title: string; bgColor: string; icon?: React.ReactNode; onClick?: () => void }> = ({ title, bgColor, icon, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-6 rounded-2xl text-white font-bold text-lg shadow-lg transform transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${bgColor}`}
        disabled={!onClick}
    >
        {icon || <BoxIcon className="w-12 h-12 mb-2" />}
        <span>{title}</span>
    </button>
);


export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
    return (
        <div className="p-4 flex flex-col h-full">
            <header className="flex items-center space-x-3 mb-8">
                 <div className="bg-violet-600 p-3 rounded-xl">
                    <BoxIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">PDA App</h1>
            </header>
            <div className="flex-grow grid grid-cols-2 grid-rows-2 gap-4">
                <MenuButton title="Nhập kho" bgColor="bg-emerald-500 hover:bg-emerald-600" />
                <MenuButton title="Xuất kho" bgColor="bg-sky-500 hover:bg-sky-600" />
                <MenuButton title="Kiểm kê" bgColor="bg-amber-500 hover:bg-amber-600" />
                <MenuButton title="Chuyển vị trí" bgColor="bg-violet-500 hover:bg-violet-600" onClick={onNavigate} />
            </div>
        </div>
    );
};
