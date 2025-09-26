// Fix: Define and export types instead of defining constants and creating a circular import.
// This resolves the circular dependency and provides the type definitions for the rest of the application.

export enum MoveMode {
    Full = 'FULL',
    Partial = 'PARTIAL'
}

export interface InventoryItem {
    id: string;
    type: 'PALLET' | 'SKU' | 'BATCH';
    name?: string;
    quantity: number;
    details: string;
    scannedSerials?: string[];
}

export interface Pallet extends InventoryItem {
    type: 'PALLET';
    skuCount: number;
}

export interface Batch extends InventoryItem {
    type: 'BATCH';
    batchId: string;
    exp: string;
}

export interface Serial {
    id:string;
    skuName: string;
}

export interface MoveTransaction {
    sourceLocator: string;
    destinationLocator: string;
    itemsToMove: InventoryItem[];
    user: string;
    timestamp: Date;
    mode: MoveMode;
}