
import React from 'react';
import { MoveTransaction } from '../../types';
import { Header } from '../common/Header';
import { CheckCircleIcon, ArrowRightIcon } from '../icons';

interface ResultScreenProps {
    transaction: MoveTransaction;
    onContinue: () => void;
    onBackToMenu: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ transaction, onContinue, onBackToMenu }) => {
    return (
        <div className="flex flex-col h-full">
            <Header title="KẾT QUẢ" />
            <main className="flex-grow p-4 flex flex-col items-center justify-center text-center">
                <CheckCircleIcon className="w-24 h-24 text-emerald-500 mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Chuyển thành công</h2>
                <p className="text-slate-300 mb-8">Giao dịch đã được ghi nhận vào hệ thống.</p>
                
                <div className="w-full bg-slate-800 border border-slate-700 p-4 rounded-lg text-left space-y-2">
                    <p className="flex justify-between text-slate-300">
                        <span>Từ Locator:</span> 
                        <span className="font-mono font-bold text-white">{transaction.sourceLocator}</span>
                    </p>
                    <p className="flex justify-between text-slate-300">
                        <span>Đến Locator:</span> 
                        <span className="font-mono font-bold text-white">{transaction.destinationLocator}</span>
                    </p>
                    <p className="flex justify-between text-slate-300">
                        <span>Tổng số lượng:</span> 
                        <span className="font-bold text-white">{transaction.itemsToMove.reduce((sum, item) => sum + item.quantity, 0)} sp</span>
                    </p>
                    <p className="flex justify-between text-slate-300">
                        <span>Người thực hiện:</span> 
                        <span className="font-bold text-white">{transaction.user}</span>
                    </p>
                    <p className="flex justify-between text-slate-300">
                        <span>Thời gian:</span> 
                        <span className="font-bold text-white text-sm">{transaction.timestamp?.toLocaleString()}</span>
                    </p>
                </div>
            </main>
            <footer className="p-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                 <button
                    onClick={onBackToMenu}
                    className="w-full flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 rounded-lg transition-all"
                >
                    Về Menu
                </button>
                 <button
                    onClick={onContinue}
                    className="w-full flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-lg transition-all"
                >
                    Chuyển tiếp <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
            </footer>
        </div>
    );
};
