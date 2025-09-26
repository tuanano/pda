
import React from 'react';
import { InventoryItem } from '../../types';
import { Header } from '../common/Header';
import { ChevronRightIcon, BarcodeIcon } from '../icons';

interface SourceInventoryScreenProps {
    sourceLocator: string;
    inventory: InventoryItem[];
    onConfirm: () => void;
}

const ItemCard: React.FC<{item: InventoryItem}> = ({ item }) => {
    return (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center space-x-4">
            <div className="p-2 bg-slate-700 rounded-md">
                <BarcodeIcon className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-grow">
                <p className="font-bold text-white">{item.name || item.id}</p>
                <p className="text-sm text-slate-400">
                    {item.id} &bull; SL: {item.quantity}
                </p>
            </div>
        </div>
    );
};

export const SourceInventoryScreen: React.FC<SourceInventoryScreenProps> = ({ sourceLocator, inventory, onConfirm }) => {
    return (
        <div className="flex flex-col h-full">
            <Header title="XÁC NHẬN CHUYỂN TOÀN BỘ" subtitle={`Từ Locator: ${sourceLocator}`} />
            <main className="flex-grow p-4 space-y-4 overflow-y-auto">
                <p className="text-slate-300 text-sm">Toàn bộ các mục sau sẽ được chuyển. Vui lòng xác nhận.</p>
                {inventory.length > 0 ? (
                    inventory.map(item => <ItemCard key={item.id} item={item} />)
                ) : (
                    <div className="text-center py-10">
                        <p className="text-slate-400">Không tìm thấy hàng trong Locator này.</p>
                    </div>
                )}
            </main>
            <footer className="p-4 border-t border-slate-700">
                <button
                    onClick={onConfirm}
                    disabled={inventory.length === 0}
                    className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Xác nhận & Quét vị trí đích <ChevronRightIcon className="w-6 h-6 ml-2" />
                </button>
            </footer>
        </div>
    );
};