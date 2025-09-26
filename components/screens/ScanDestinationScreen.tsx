import React, { useState, useMemo } from 'react';
import { Header } from '../common/Header';
import { CameraIcon, CheckCircleIcon, XCircleIcon, CheckIcon, AlertTriangleIcon, XIcon, BarcodeIcon, HomeIcon } from '../icons';
import { MOCK_LOCATORS, MOCK_INVENTORY } from '../../constants';
import { InventoryItem } from '../../types';

interface ScanDestinationScreenProps {
    sourceLocator: string;
    onConfirm: (destination: string) => void;
}

const ItemCard: React.FC<{item: InventoryItem}> = ({ item }) => (
    <div className="bg-slate-700 p-3 rounded-lg flex items-center space-x-4">
        <div className="p-2 bg-slate-600 rounded-md">
            <BarcodeIcon className="w-6 h-6 text-slate-300" />
        </div>
        <div className="flex-grow">
            <p className="font-bold text-white">{item.name || item.id}</p>
            <p className="text-sm text-slate-400">
                {item.id} &bull; SL: {item.quantity}
            </p>
        </div>
    </div>
);


const InventoryPreviewModal: React.FC<{ inventory: InventoryItem[], title: string, onClose: () => void }> = ({ inventory, title, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm border border-slate-700 flex flex-col h-[70vh]">
                <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white" dangerouslySetInnerHTML={{ __html: title }}></h3>
                     <p className="text-sm text-slate-400">Tổng cộng: {inventory.length} loại hàng</p>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-2">
                    {inventory.length > 0 ? (
                        inventory.map(item => <ItemCard key={item.id} item={item} />)
                    ) : (
                        <p className="text-slate-400 text-center py-4">Không có thông tin hàng hóa.</p>
                    )}
                </div>
                <div className="p-4 border-t border-slate-700">
                    <button onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-md">Đóng</button>
                </div>
            </div>
        </div>
    );
};


export const ScanDestinationScreen: React.FC<ScanDestinationScreenProps> = ({ sourceLocator, onConfirm }) => {
    const [destinationInput, setDestinationInput] = useState('');
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    
    // Memoized helpers for efficient validation
    const palletFinder = useMemo(() => {
        const allPallets = new Map<string, { pallet: InventoryItem, locator: string }>();
        Object.entries(MOCK_INVENTORY).forEach(([locator, items]) => {
            items.forEach(item => {
                if (item.type === 'PALLET') {
                    allPallets.set(item.id.toUpperCase(), { pallet: item, locator });
                }
            });
        });
        return allPallets;
    }, []);

    const destinationState = useMemo(() => {
        const key = destinationInput.trim().toUpperCase();
        if (!key) return { type: 'EMPTY', isValid: false, data: null };

        // 1. Check for Pallet
        const foundPallet = palletFinder.get(key);
        if (foundPallet) {
            const contents = MOCK_INVENTORY[foundPallet.locator] || [];
            return { type: 'VALID_PALLET', isValid: true, data: { ...foundPallet, contents } };
        }

        // 2. Check for Locator
        const locatorInfo = MOCK_LOCATORS[key];
        
        if (key === sourceLocator) {
            return { type: 'INVALID', isValid: false, data: { reason: 'Không thể chuyển đến vị trí nguồn.' } };
        }
        
        if (locatorInfo && locatorInfo.valid) {
            const inventory = MOCK_INVENTORY[key] || [];
            const isOccupied = inventory.length > 0;
            return { type: isOccupied ? 'OCCUPIED' : 'VALID', isValid: true, data: { info: locatorInfo, inventory } };
        }

        // 3. If it's neither, it's invalid
        return { type: 'INVALID', isValid: false, data: { reason: 'Mã Vị trí hoặc Pallet không tồn tại/hợp lệ.' } };
    }, [destinationInput, sourceLocator, palletFinder]);

    const handleClearInput = () => {
        setDestinationInput('');
    };
    
    const handleConfirm = () => {
        if (!destinationState.isValid) return;

        const { type, data } = destinationState;
        let destinationString = destinationInput.trim().toUpperCase();

        if (type === 'VALID_PALLET' && data?.pallet) {
            destinationString = `${data.pallet.id}(${data.locator})`;
        }
        
        onConfirm(destinationString);
    }

    const modalData = useMemo(() => {
        if (destinationState.type === 'OCCUPIED' && destinationState.data) {
            return {
                title: `Hàng hóa tại <span class="text-violet-400 font-mono">${destinationInput.toUpperCase()}</span>`,
                inventory: destinationState.data.inventory,
            };
        }
        if (destinationState.type === 'VALID_PALLET' && destinationState.data) {
            return {
                title: `Hàng tại vị trí của Pallet <span class="text-violet-400 font-mono">${destinationState.data.pallet.id}</span>`,
                inventory: destinationState.data.contents
            };
        }
        return null;
    }, [destinationState, destinationInput]);

    const renderStatusContent = () => {
        const { type, isValid, data } = destinationState;
        
        if (type === 'EMPTY') return null;
        
        if (!isValid) {
            return (
                 <div className="p-4 rounded-lg border-2 border-red-500 bg-red-500/10">
                    <div className="flex items-center">
                        <XCircleIcon className="w-8 h-8 text-red-500 mr-3 flex-shrink-0"/>
                        <div>
                            <h3 className="text-xl font-bold text-white">Không hợp lệ</h3>
                            {data?.reason && <p className="text-red-300 text-sm mt-1">{data.reason}</p>}
                        </div>
                    </div>
                </div>
            )
        }
        
        return (
            <>
            {/* Status Box */}
             <div className={`p-4 rounded-lg border-2 ${type === 'OCCUPIED' ? 'border-amber-500 bg-amber-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
                <div className="flex items-center">
                    {type === 'OCCUPIED' ? <AlertTriangleIcon className="w-8 h-8 text-amber-500 mr-3"/> : <CheckCircleIcon className="w-8 h-8 text-emerald-500 mr-3"/>}
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {type === 'OCCUPIED' && 'Trạng thái: Cảnh báo'}
                            {type === 'VALID' && 'Trạng thái: Hợp lệ / Trống'}
                            {type === 'VALID_PALLET' && 'Pallet hợp lệ'}
                        </h3>
                         {type === 'OCCUPIED' && <p className="mt-1 text-amber-300 text-sm">Vị trí này đang chứa hàng.</p>}
                    </div>
                </div>
                {(type === 'OCCUPIED' || type === 'VALID_PALLET') && (
                     <button 
                        onClick={() => setShowInventoryModal(true)}
                        className="mt-3 text-sm font-semibold text-violet-300 bg-violet-500/20 hover:bg-violet-500/40 px-3 py-1.5 rounded-md"
                    >
                        {type === 'OCCUPIED' ? 'Xem chi tiết hàng hóa' : 'Xem hàng cùng vị trí'}
                    </button>
                )}
            </div>
            {/* Info Box */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-2">
                 {type === 'VALID_PALLET' && data?.pallet && (
                     <>
                        <p className="flex justify-between text-slate-300">
                            <span>Mã Pallet:</span> 
                            <span className="font-bold text-white font-mono">{data.pallet.id}</span>
                        </p>
                        <p className="flex justify-between text-slate-300">
                            <span>Vị trí hiện tại:</span> 
                            <span className="font-bold text-white font-mono">{data.locator}</span>
                        </p>
                     </>
                 )}
                 {(type === 'VALID' || type === 'OCCUPIED') && data?.info && (
                    <p className="flex justify-between text-slate-300">
                        <span>Khu vực (Zone):</span> 
                        <span className="font-bold text-white">{data.info.zone}</span>
                    </p>
                 )}
            </div>
            </>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {showInventoryModal && modalData && (
                <InventoryPreviewModal 
                    inventory={modalData.inventory} 
                    title={modalData.title}
                    onClose={() => setShowInventoryModal(false)} 
                />
            )}
            <Header title="QUÉT ĐIỂM ĐẾN" subtitle="Quét mã Pallet hoặc Vị trí đích" />
            <main className="flex-grow p-4 space-y-6">
                <div>
                    <label htmlFor="dest-locator" className="text-sm font-medium text-slate-300 mb-2 block">
                        Quét Vị trí / Pallet đích
                    </label>
                    <div className="relative">
                        <input
                            id="dest-locator"
                            type="text"
                            value={destinationInput}
                            onChange={(e) => setDestinationInput(e.target.value)}
                            placeholder="Ví dụ: B2-03 hoặc PAL-007"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-4 pr-12 text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                            autoFocus
                        />
                        <button className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-violet-400">
                            <CameraIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4 animate-fade-in">
                    {renderStatusContent()}
                </div>
            </main>
            <footer className="p-4 border-t border-slate-700">
                {destinationState.type === 'OCCUPIED' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleClearInput}
                            className="w-full flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 rounded-lg transition-all"
                        >
                           <XIcon className="w-5 h-5 mr-2"/> Quét lại
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="w-full flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-lg transition-all"
                        >
                            <CheckIcon className="w-6 h-6 mr-2" /> Vẫn tiếp tục
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleConfirm}
                        disabled={!destinationState.isValid}
                        className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <CheckIcon className="w-6 h-6 mr-2" /> Xác nhận chuyển
                    </button>
                )}
            </footer>
        </div>
    );
};