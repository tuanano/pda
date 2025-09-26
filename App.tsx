
import React, { useState } from 'react';
import { MainMenu } from './components/screens/MainMenu';
import { SelectModeScreen } from './components/screens/SelectModeScreen';
import { UnifiedPickingScreen } from './components/screens/UnifiedPickingScreen';
import { ScanDestinationScreen } from './components/screens/ScanDestinationScreen';
import { ConfirmationScreen } from './components/screens/ConfirmationScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { Footer } from './components/common/Footer';
import { MoveMode, InventoryItem, MoveTransaction } from './types';
import { MOCK_INVENTORY } from './constants';

type Screen = 
    | 'MAIN_MENU'
    | 'SELECT_MODE'
    | 'UNIFIED_PICKING'
    | 'SCAN_DESTINATION'
    | 'CONFIRMATION'
    | 'RESULT';

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('MAIN_MENU');
    const [sourceLocator, setSourceLocator] = useState<string>('');
    const [destinationLocator, setDestinationLocator] = useState<string>('');
    const [itemsToMove, setItemsToMove] = useState<InventoryItem[]>([]);
    const [transaction, setTransaction] = useState<MoveTransaction | null>(null);

    const resetState = () => {
        setScreen('MAIN_MENU');
        setSourceLocator('');
        setDestinationLocator('');
        setItemsToMove([]);
        setTransaction(null);
    };
    
    const startNewMove = () => {
        setSourceLocator('');
        setDestinationLocator('');
        setItemsToMove([]);
        setTransaction(null);
        setScreen('SELECT_MODE');
    }

    const handleStartMove = () => {
        startNewMove();
    };

    const handleSourceScanned = (locator: string) => {
        setSourceLocator(locator.toUpperCase());
        setScreen('UNIFIED_PICKING');
    };
    
    const handlePickingConfirmed = (items: InventoryItem[]) => {
        setItemsToMove(items);
        setScreen('SCAN_DESTINATION');
    };

    const handlePickingCancelled = () => {
        setSourceLocator('');
        setItemsToMove([]);
        setScreen('SELECT_MODE');
    };
    
    const handleDestinationScanned = (destination: string) => {
        setDestinationLocator(destination);
        setScreen('CONFIRMATION');
    };

    const handleConfirmTransaction = () => {
        const sourceInventory = MOCK_INVENTORY[sourceLocator] || [];
        const isFullMove = sourceInventory.length > 0 && 
                           itemsToMove.length === sourceInventory.length && 
                           itemsToMove.every(itemToMove => {
                               const sourceItem = sourceInventory.find(si => si.id === itemToMove.id);
                               return sourceItem && itemToMove.quantity === sourceItem.quantity;
                           });

        const newTransaction: MoveTransaction = {
            sourceLocator,
            destinationLocator,
            itemsToMove,
            user: 'user@example.com',
            timestamp: new Date(),
            mode: isFullMove ? MoveMode.Full : MoveMode.Partial,
        };
        setTransaction(newTransaction);
        setScreen('RESULT');
    };
    
    const renderScreen = () => {
        switch (screen) {
            case 'MAIN_MENU':
                return <MainMenu onNavigate={handleStartMove} />;
            case 'SELECT_MODE':
                return <SelectModeScreen onContinue={handleSourceScanned} />;
            case 'UNIFIED_PICKING':
                 return <UnifiedPickingScreen 
                            sourceLocator={sourceLocator}
                            onConfirm={handlePickingConfirmed} 
                            onCancel={handlePickingCancelled} />;
            case 'SCAN_DESTINATION':
                return <ScanDestinationScreen sourceLocator={sourceLocator} onConfirm={handleDestinationScanned} />;
            case 'CONFIRMATION':
                return <ConfirmationScreen 
                            sourceLocator={sourceLocator}
                            destinationLocator={destinationLocator}
                            itemsToMove={itemsToMove}
                            onConfirm={handleConfirmTransaction}
                            onBack={() => setScreen('SCAN_DESTINATION')}
                        />;
            case 'RESULT':
                if (!transaction) return <MainMenu onNavigate={handleStartMove} />;
                return <ResultScreen transaction={transaction} onContinue={startNewMove} onBackToMenu={resetState} />;
            default:
                return <MainMenu onNavigate={handleStartMove} />;
        }
    };

    return (
        <div className="bg-slate-900 text-slate-100 h-screen w-screen flex flex-col font-sans">
            <div className="flex-grow overflow-y-auto">
                {renderScreen()}
            </div>
            {screen !== 'MAIN_MENU' && <Footer onHomeClick={resetState} />}
        </div>
    );
};

export default App;
