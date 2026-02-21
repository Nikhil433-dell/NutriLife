export const INITIAL_INVENTORY = [
  { id: 1, item: 'Canned Soup', category: 'food', quantity: 240, unit: 'cans', threshold: 50, lastRestocked: '2025-02-15' },
  { id: 2, item: 'Rice (5lb bags)', category: 'food', quantity: 85, unit: 'bags', threshold: 20, lastRestocked: '2025-02-10' },
  { id: 3, item: 'Blankets', category: 'supplies', quantity: 130, unit: 'units', threshold: 30, lastRestocked: '2025-01-28' },
  { id: 4, item: 'Hygiene Kits', category: 'hygiene', quantity: 75, unit: 'kits', threshold: 25, lastRestocked: '2025-02-12' },
  { id: 5, item: 'Winter Coats', category: 'clothing', quantity: 42, unit: 'units', threshold: 15, lastRestocked: '2024-12-01' },
  { id: 6, item: 'First Aid Kits', category: 'medical', quantity: 18, unit: 'kits', threshold: 10, lastRestocked: '2025-02-05' },
  { id: 7, item: 'Water Bottles (24pk)', category: 'food', quantity: 60, unit: 'cases', threshold: 20, lastRestocked: '2025-02-18' },
  { id: 8, item: 'Sleeping Bags', category: 'supplies', quantity: 55, unit: 'units', threshold: 20, lastRestocked: '2025-01-20' },
];

export const INITIAL_DISTRIBUTIONS = [
  {
    id: 1,
    date: '2025-02-20',
    shelterId: 1,
    shelterName: 'Downtown Community Center',
    items: [
      { inventoryId: 1, item: 'Canned Soup', quantity: 30 },
      { inventoryId: 4, item: 'Hygiene Kits', quantity: 10 },
    ],
    distributedBy: 'Admin',
    notes: 'Regular weekly distribution.',
  },
  {
    id: 2,
    date: '2025-02-19',
    shelterId: 3,
    shelterName: 'Eastside Family Shelter',
    items: [
      { inventoryId: 3, item: 'Blankets', quantity: 20 },
      { inventoryId: 5, item: 'Winter Coats', quantity: 10 },
    ],
    distributedBy: 'Volunteer Team',
    notes: 'Emergency delivery due to capacity spike.',
  },
  {
    id: 3,
    date: '2025-02-18',
    shelterId: 5,
    shelterName: 'Westside Warming Center',
    items: [
      { inventoryId: 7, item: 'Water Bottles (24pk)', quantity: 15 },
      { inventoryId: 8, item: 'Sleeping Bags', quantity: 25 },
    ],
    distributedBy: 'Admin',
    notes: 'Cold-weather supply drop.',
  },
];
