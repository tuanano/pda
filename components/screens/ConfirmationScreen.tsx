
import React from 'react';
import { InventoryItem } from '../../types';
import { Header } from '../common/Header';
import { ArrowRightIcon, CheckIcon } from '../icons';

interface ConfirmationScreenProps {
    sourceLocator: string;
    destinationLocator: string;
    itemsToMove: InventoryItem[];
    onConfirm: () => void;
    onBack: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
    sourceLocator,
    destinationLocator,
    itemsToMove,
    onConfirm,
    onBack,
}) => {
    const totalQuantity = itemsToMove.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex flex-col h-full">
            <Header title="XÁC NHẬN GIAO DỊCH" subtitle="Kiểm tra lại thông tin trước khi xác nhận" />
            <main className="flex-grow p-4 space-y-4">
                <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-center">
                        <p className="text-sm text-slate-400">Từ</p>
                        <p className="text-2xl font-bold font-mono text-white">{sourceLocator}</p>
                    </div>
                    <ArrowRightIcon className="w-8 h-8 text-slate-500" />
                    <div className="text-center">
                        <p className="text-sm text-slate-400">Đến</p>
                        <p className="text-2xl font-bold font-mono text-white">{destinationLocator}</p>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-2">Chi tiết hàng hóa</h3>
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                        {itemsToMove.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-slate-300">{item.name || item.id}</span>
                                <span className="font-bold text-white">SL: {item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-700 mt-3 pt-3 flex justify-between">
                         <span className="font-bold text-white">Tổng số lượng</span>
                         <span className="font-bold text-emerald-400">{totalQuantity} sp</span>
                    </div>
                </div>
            </main>
            <footer className="p-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                <button
                    onClick={onBack}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 rounded-lg transition-all"
                >
                    Quay lại
                </button>
                <button
                    onClick={onConfirm}
                    className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg transition-all"
                >
                    <CheckIcon className="w-6 h-6 mr-2" /> Hoàn tất
                </button>
            </footer>
        </div>
    );
};