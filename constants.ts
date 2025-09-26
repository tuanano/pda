
import { type InventoryItem, type Pallet, type Batch, type Serial } from './types';

export const MOCK_INVENTORY: Record<string, InventoryItem[]> = {
    'A1-01': [
        { id: 'PAL-001', type: 'PALLET', quantity: 10, details: '10 Boxes', skuCount: 1 } as Pallet,
        { id: 'SKU-G-S24', type: 'SKU', name: 'Galaxy S24', quantity: 5, details: 'Loose items' },
        { id: 'BATCH-P-2025A', type: 'BATCH', name: 'Panadol 500mg', quantity: 100, batchId: '2025A', exp: '12/2025' } as Batch,
        { id: 'SKU-A-M3', type: 'SKU', name: 'Macbook Air M3', quantity: 3, details: 'Loose items' },
        { id: 'PAL-002', type: 'PALLET', quantity: 5, details: '5 units', skuCount: 1 } as Pallet,
    ],
    'B2-03': [
         { id: 'PAL-007', type: 'PALLET', quantity: 20, details: '20 units', skuCount: 1 } as Pallet,
    ]
};

export const MOCK_SERIALS: Record<string, Serial[]> = {
    'iPhone 15 Pro': Array.from({ length: 10 }, (_, i) => ({ id: `SN-IP15-A${1001 + i}`, skuName: 'iPhone 15 Pro'})),
    'Macbook Air M3': Array.from({ length: 3 }, (_, i) => ({ id: `SN-MBA3-B${2001 + i}`, skuName: 'Macbook Air M3'})),
    'Dell XPS 15': Array.from({ length: 5 }, (_, i) => ({ id: `SN-DXPS-C${3001 + i}`, skuName: 'Dell XPS 15'})),
    'Galaxy S24': Array.from({ length: 5 }, (_, i) => ({ id: `SN-GS24-D${4001 + i}`, skuName: 'Galaxy S24'})),
}

export const MOCK_LOCATORS: Record<string, { zone: string; capacity: number; conditions: string; valid: boolean }> = {
    'B2-03': {
        zone: 'B',
        capacity: 50,
        conditions: 'Ambient Temperature',
        valid: true,
    },
    'C4-11': {
        zone: 'C',
        capacity: 10,
        conditions: 'Cold Storage',
        valid: true,
    },
    'A1-01': {
        zone: 'A',
        capacity: 0,
        conditions: 'Ambient Temperature',
        valid: false, // Can't move to itself
    },
    'ERR-01': {
        zone: 'N/A',
        capacity: 0,
        conditions: 'N/A',
        valid: false,
    }
}