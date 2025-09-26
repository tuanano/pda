
import React, { useState } from 'react';
import { Header } from '../common/Header';
import { CameraIcon, ChevronRightIcon } from '../icons';

interface SelectModeScreenProps {
    onContinue: (locator: string) => void;
}

export const SelectModeScreen: React.FC<SelectModeScreenProps> = ({ onContinue }) => {
    const [sourceLocator, setSourceLocator] = useState('');

    const handleContinue = () => {
        if (sourceLocator.trim()) {
            onContinue(sourceLocator.trim().toUpperCase());
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            <Header title="CHUYỂN VỊ TRÍ" subtitle="Quét vị trí nguồn để bắt đầu" />
            <main className="flex-grow p-4 space-y-6 flex flex-col justify-center">
                <div>
                    <label htmlFor="source-locator" className="text-sm font-medium text-slate-300 mb-2 block">
                        Quét Locator nguồn
                    </label>
                    <div className="relative">
                        <input
                            id="source-locator"
                            type="text"
                            value={sourceLocator}
                            onChange={(e) => setSourceLocator(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                            placeholder="Ví dụ: A1-01"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-4 pr-12 text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                            autoFocus
                        />
                        <button className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-violet-400">
                            <CameraIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </main>
            <footer className="p-4 border-t border-slate-700">
                <button
                    onClick={handleContinue}
                    disabled={!sourceLocator.trim()}
                    className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Xác nhận & Gom hàng <ChevronRightIcon className="w-6 h-6 ml-2" />
                </button>
            </footer>
        </div>
    );
};
