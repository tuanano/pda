
import React, { useState, useMemo, useCallback } from 'react';
import { InventoryItem } from '../../types';
import { MOCK_INVENTORY, MOCK_SERIALS } from '../../constants';
import { Header } from '../common/Header';
import { ChevronRightIcon, CameraIcon, BarcodeIcon, XIcon, CheckCircleIcon, XCircleIcon } from '../icons';

// Local type for items staged for moving
interface StagedItem extends InventoryItem {
    quantityToMove: number;
    scannedSerials?: string[];
}

// Props for the quantity input modal
interface QuantityModalProps {
    item: StagedItem;
    onClose: () => void;
    onConfirm: (itemId: string, quantity: number) => void;
}

// Props for the serial detail modal
interface SerialDetailModalProps {
    item: StagedItem;
    onClose: () => void;
    onRemoveSerial: (itemId: string, serial: string) => void;
}


// A simple feedback toast component
const FeedbackToast: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
        {type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
        <span>{message}</span>
    </div>
);

const QuantityModal: React.FC<QuantityModalProps> = ({ item, onClose, onConfirm }) => {
    const [quantity, setQuantity] = useState(1);

    const handleConfirm = () => {
        if (quantity > 0 && quantity <= item.quantity) {
            onConfirm(item.id, quantity);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm border border-slate-700">
                <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">{item.name || item.id}</h3>
                    <p className="text-sm text-slate-400">Tồn kho tối đa: {item.quantity}</p>
                </div>
                <div className="p-4 space-y-4">
                    <label htmlFor="quantity-input" className="text-slate-300">Nhập số lượng cần chuyển:</label>
                    <input
                        id="quantity-input"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(item.quantity, parseInt(e.target.value, 10) || 1)))}
                        className="w-full text-center bg-slate-700 border border-slate-600 rounded-lg py-3 text-2xl font-bold text-white focus:ring-2 focus:ring-violet-500 outline-none"
                        autoFocus
                    />
                </div>
                <div className="p-4 grid grid-cols-2 gap-3 bg-slate-800/50 rounded-b-lg">
                    <button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-md">Hủy</button>
                    <button onClick={handleConfirm} className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-md">Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

const SerialDetailModal: React.FC<SerialDetailModalProps> = ({ item, onClose, onRemoveSerial }) => {
    const [filter, setFilter] = useState('');
    const filteredSerials = useMemo(() => {
        return item.scannedSerials?.filter(s => s.toLowerCase().includes(filter.toLowerCase())) || [];
    }, [filter, item.scannedSerials]);

    return (
         <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm border border-slate-700 flex flex-col h-[80vh]">
                <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">Serials cho {item.name}</h3>
                    <p className="text-sm text-slate-400">Đã quét: {item.scannedSerials?.length || 0}</p>
                </div>
                <div className="p-4">
                     <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Tìm kiếm serial..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                </div>
                <div className="flex-grow overflow-y-auto px-4 space-y-2">
                    {filteredSerials.map(serial => (
                        <div key={serial} className="flex items-center justify-between bg-slate-700 text-slate-200 text-sm font-mono rounded-md px-3 py-2">
                            <span>{serial}</span>
                            <button onClick={() => onRemoveSerial(item.id, serial)} className="p-1 rounded-full hover:bg-red-500/50 text-slate-400 hover:text-white transition-colors">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-700">
                    <button onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-md">Đóng</button>
                </div>
            </div>
        </div>
    );
}

export const UnifiedPickingScreen: React.FC<{
    sourceLocator: string;
    onConfirm: (items: InventoryItem[]) => void;
    onCancel: () => void;
}> = ({ sourceLocator, onConfirm, onCancel }) => {
    const [scanInput, setScanInput] = useState('');
    const [stagedItems, setStagedItems] = useState<StagedItem[]>([]);
    const [itemForModal, setItemForModal] = useState<StagedItem | null>(null);
    const [viewingSerialsFor, setViewingSerialsFor] = useState<StagedItem | null>(null);
    const [feedback, setFeedback] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const sourceInventory = useMemo(() => MOCK_INVENTORY[sourceLocator] || [], [sourceLocator]);
    const allSerials = useMemo(() => Object.values(MOCK_SERIALS).flat(), []);

    const showFeedback = (message: string, type: 'success' | 'error') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 2000);
    };

    const handlePickAll = () => {
        if (sourceInventory.length === 0) {
            showFeedback('Không có hàng trong locator', 'error');
            return;
        }
        
        const allItemsToStage = sourceInventory.map(item => {
            const serials = (item.type === 'SKU' && item.name) ? MOCK_SERIALS[item.name]?.map(s => s.id) || [] : [];
            return {
                ...item,
                quantityToMove: item.quantity,
                scannedSerials: serials
            };
        });

        setStagedItems(allItemsToStage);
        showFeedback(`Đã chọn toàn bộ ${allItemsToStage.length} loại hàng`, 'success');
    };
    
    const handleScan = useCallback(() => {
        const code = scanInput.trim().toUpperCase();
        if (!code) return;

        // Priority 1: Check if it's a known serial
        const serialMatch = allSerials.find(s => s.id.toUpperCase() === code);
        if (serialMatch) {
            const parentItem = sourceInventory.find(item => item.name === serialMatch.skuName);
            if (!parentItem) {
                showFeedback(`Serial ${code} không có trong locator này`, 'error');
                setScanInput('');
                return;
            }

            setStagedItems(prev => {
                const existingItem = prev.find(item => item.id === parentItem.id);
                if (existingItem) {
                    if (existingItem.scannedSerials?.find(s => s.toUpperCase() === code)) {
                        showFeedback(`Serial ${code} đã được quét`, 'error');
                        return prev;
                    }
                    showFeedback(`Đã quét Serial ${code}`, 'success');
                    return prev.map(item =>
                        item.id === parentItem.id
                            ? {
                                ...item,
                                quantityToMove: item.quantityToMove + 1,
                                scannedSerials: [...(item.scannedSerials || []), serialMatch.id],
                            }
                            : item
                    );
                } else {
                    showFeedback(`Đã quét Serial ${code}`, 'success');
                    return [
                        ...prev,
                        { ...parentItem, quantityToMove: 1, scannedSerials: [serialMatch.id] },
                    ];
                }
            });
            setScanInput('');
            return;
        }

        // Priority 2: Check if it's a Pallet, SKU, or Batch ID
        const itemMatch = sourceInventory.find(item => item.id.toUpperCase() === code);
        if (itemMatch) {
            if (stagedItems.some(item => item.id === itemMatch.id)) {
                showFeedback(`${itemMatch.type} ${code} đã được thêm`, 'error');
                setScanInput('');
                return;
            }
            
            if (itemMatch.type === 'PALLET' || itemMatch.type === 'SKU') {
                const serials = (itemMatch.type === 'SKU' && itemMatch.name) ? MOCK_SERIALS[itemMatch.name]?.map(s => s.id) || [] : [];
                setStagedItems(prev => [...prev, { ...itemMatch, quantityToMove: itemMatch.quantity, scannedSerials: serials }]);
                showFeedback(`Đã thêm toàn bộ ${itemMatch.type} ${code}`, 'success');
            } else { // BATCH
                setItemForModal({ ...itemMatch, quantityToMove: 0 });
            }
            setScanInput('');
            return;
        }

        showFeedback(`Mã ${code} không hợp lệ`, 'error');
        setScanInput('');
    }, [scanInput, sourceInventory, allSerials, stagedItems]);


    const handleQuantityConfirm = (itemId: string, quantity: number) => {
        setStagedItems(prev => {
            const existingItem = prev.find(item => item.id === itemId);
            if (existingItem) {
                return prev.map(item => item.id === itemId ? { ...item, quantityToMove: item.quantityToMove + quantity } : item);
            }
            const newItem = sourceInventory.find(item => item.id === itemId);
            if (newItem) {
                return [...prev, { ...newItem, quantityToMove: quantity }];
            }
            return prev;
        });
        showFeedback(`Đã thêm ${quantity} sản phẩm`, 'success');
        setItemForModal(null);
    };
    
    const removeItem = (itemId: string) => {
        setStagedItems(prev => prev.filter(item => item.id !== itemId));
        showFeedback('Đã xóa sản phẩm', 'success');
    };

    const removeSerial = (itemId: string, serialToRemove: string) => {
        let itemWasRemoved = false;
        setStagedItems(prev => {
            const itemIndex = prev.findIndex(item => item.id === itemId);
            if (itemIndex === -1) return prev;

            const updatedItem = { ...prev[itemIndex] };
            updatedItem.scannedSerials = updatedItem.scannedSerials?.filter(s => s !== serialToRemove);
            updatedItem.quantityToMove = updatedItem.scannedSerials?.length || 0;
            
            if (updatedItem.quantityToMove === 0) {
                 itemWasRemoved = true;
                return prev.filter(item => item.id !== itemId);
            }

            const newStagedItems = [...prev];
            newStagedItems[itemIndex] = updatedItem;
            // Also update the item in the modal if it's open
            if(viewingSerialsFor?.id === itemId){
                setViewingSerialsFor(updatedItem);
            }
            return newStagedItems;
        });
        
        if (itemWasRemoved) {
             setViewingSerialsFor(null);
        }

        showFeedback(`Đã xóa Serial ${serialToRemove}`, 'success');
    };

    const handleFinalConfirm = () => {
        const itemsToMove: InventoryItem[] = stagedItems
            .filter(item => item.quantityToMove > 0)
            .map(({ quantityToMove, ...rest }) => ({
                ...rest,
                quantity: quantityToMove,
                scannedSerials: rest.scannedSerials && rest.scannedSerials.length > 0 ? rest.scannedSerials : undefined,
            }));
        onConfirm(itemsToMove);
    };

    const totalItemsPicked = stagedItems.reduce((sum, item) => sum + item.quantityToMove, 0);

    return (
        <div className="flex flex-col h-full">
            {itemForModal && (
                <QuantityModal
                    item={itemForModal}
                    onClose={() => setItemForModal(null)}
                    onConfirm={handleQuantityConfirm}
                />
            )}
            {viewingSerialsFor && (
                <SerialDetailModal 
                    item={viewingSerialsFor}
                    onClose={() => setViewingSerialsFor(null)}
                    onRemoveSerial={removeSerial}
                />
            )}
            {feedback && <FeedbackToast message={feedback.message} type={feedback.type} />}

            <Header title="GOM HÀNG" subtitle={`Từ Locator: ${sourceLocator}`} />

            <div className="p-4 sticky top-0 bg-slate-900 z-10 border-b border-slate-700 space-y-3">
                <div className="relative">
                    <input
                        type="text"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                        placeholder="Quét mã Pallet, SKU, Serial..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-4 pr-12 text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                        autoFocus
                    />
                    <button onClick={handleScan} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-violet-400">
                        <CameraIcon className="w-6 h-6" />
                    </button>
                </div>
                 <button
                    onClick={handlePickAll}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all text-sm"
                >
                    CHỌN TOÀN BỘ HÀNG HÓA
                </button>
            </div>

            <main className="flex-grow p-4 space-y-3 overflow-y-auto">
                {stagedItems.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        <BarcodeIcon className="w-16 h-16 mx-auto mb-4" />
                        <p>Chưa có hàng hóa nào được chọn.</p>
                        <p className="text-sm">Hãy bắt đầu bằng việc quét mã hoặc chọn toàn bộ.</p>
                    </div>
                ) : (
                    stagedItems.map(item => (
                        <div key={item.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 animate-fade-in">
                            <div className="flex items-start">
                                <div className="flex-grow">
                                    <p className="font-bold text-white">{item.name || item.id}</p>
                                    <p className="text-sm text-slate-400">{item.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-violet-400">{item.quantityToMove}</p>
                                    <p className="text-xs text-slate-500">/ {item.quantity} tồn kho</p>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="ml-3 p-1 text-slate-500 hover:text-red-400">
                                    <XIcon className="w-5 h-5"/>
                                </button>
                            </div>
                            {item.scannedSerials && item.scannedSerials.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-slate-700">
                                    <div className="flex justify-between items-center">
                                         <p className="text-sm font-semibold text-slate-300">
                                            Đã quét: <span className="text-violet-400">{item.scannedSerials.length}</span> Serials
                                        </p>
                                        <button onClick={() => setViewingSerialsFor(item)} className="text-xs bg-slate-700 hover:bg-slate-600 text-violet-300 font-semibold px-3 py-1 rounded-md">
                                            Xem & Sửa
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </main>

            <footer className="p-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                 <button
                    onClick={onCancel}
                    className="w-full flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 rounded-lg transition-all"
                >
                    Hủy
                </button>
                 <button
                    onClick={handleFinalConfirm}
                    disabled={totalItemsPicked === 0}
                    className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Xác nhận ({totalItemsPicked} sp) <ChevronRightIcon className="w-6 h-6 ml-2" />
                </button>
            </footer>
        </div>
    );
};