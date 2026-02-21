/**
 * Seeds Firestore with initial data: shelters, inventory, distributions, community messages, and an admin user.
 * Run: node scripts/seed.js
 * Requires GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON to be set.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { getDb } = require('../config/firebase');

const SHELTERS = [
  { id: 1, name: 'Downtown Community Center', address: '123 Main St, City Center', lat: 44.9778, lng: -93.265, capacity: 120, current: 87, rating: 4.8, distance: 0.3, services: ['meals', 'beds', 'showers', 'medical'], hours: '24/7', phone: '(555) 123-4567', description: 'Full-service emergency shelter providing meals, safe sleeping, hygiene facilities, and basic medical screening.', tags: ['family-friendly', 'pet-friendly', 'accessible'], lastUpdated: '2 min ago' },
  { id: 2, name: 'Riverside Nutrition Hub', address: '456 River Rd, Riverside', lat: 44.9537, lng: -93.09, capacity: 80, current: 34, rating: 4.6, distance: 0.8, services: ['meals', 'groceries', 'counseling'], hours: '7am – 9pm', phone: '(555) 234-5678', description: 'Focused on nutrition and food security. Provides hot meals, grocery assistance, and dietary counseling.', tags: ['nutrition-focused', 'accessible'], lastUpdated: '15 min ago' },
  { id: 3, name: 'Eastside Family Shelter', address: '789 East Ave, Eastside', lat: 44.9636, lng: -93.2099, capacity: 60, current: 58, rating: 4.4, distance: 1.2, services: ['beds', 'meals', 'childcare', 'laundry'], hours: '6pm – 8am', phone: '(555) 345-6789', description: 'Overnight shelter specifically for families with children.', tags: ['family-friendly', 'children-welcome'], lastUpdated: '1 hr ago' },
  { id: 4, name: 'Veterans Support Center', address: '321 Honor Blvd, Midtown', lat: 44.9411, lng: -93.2683, capacity: 50, current: 22, rating: 4.9, distance: 1.5, services: ['beds', 'meals', 'mental-health', 'job-placement'], hours: '24/7', phone: '(555) 456-7890', description: 'Dedicated support center for veterans.', tags: ['veterans-only', 'mental-health', 'accessible'], lastUpdated: '30 min ago' },
  { id: 5, name: 'Westside Warming Center', address: '654 West St, Westside', lat: 44.9334, lng: -93.3206, capacity: 200, current: 145, rating: 4.2, distance: 2.1, services: ['warming', 'meals', 'clothing'], hours: 'Nov–Mar: 8pm – 8am', phone: '(555) 567-8901', description: 'Seasonal warming center operating during cold months.', tags: ['seasonal', 'large-capacity'], lastUpdated: '45 min ago' },
];

const INVENTORY = [
  { id: 1, item: 'Canned Soup', category: 'food', quantity: 240, unit: 'cans', threshold: 50, lastRestocked: '2025-02-15' },
  { id: 2, item: 'Rice (5lb bags)', category: 'food', quantity: 85, unit: 'bags', threshold: 20, lastRestocked: '2025-02-10' },
  { id: 3, item: 'Blankets', category: 'supplies', quantity: 130, unit: 'units', threshold: 30, lastRestocked: '2025-01-28' },
  { id: 4, item: 'Hygiene Kits', category: 'hygiene', quantity: 75, unit: 'kits', threshold: 25, lastRestocked: '2025-02-12' },
  { id: 5, item: 'Winter Coats', category: 'clothing', quantity: 42, unit: 'units', threshold: 15, lastRestocked: '2024-12-01' },
  { id: 6, item: 'First Aid Kits', category: 'medical', quantity: 18, unit: 'kits', threshold: 10, lastRestocked: '2025-02-05' },
  { id: 7, item: 'Water Bottles (24pk)', category: 'food', quantity: 60, unit: 'cases', threshold: 20, lastRestocked: '2025-02-18' },
  { id: 8, item: 'Sleeping Bags', category: 'supplies', quantity: 55, unit: 'units', threshold: 20, lastRestocked: '2025-01-20' },
];

const DISTRIBUTIONS = [
  { id: 1, date: '2025-02-20', shelterId: 1, shelterName: 'Downtown Community Center', items: [{ inventoryId: 1, item: 'Canned Soup', quantity: 30 }, { inventoryId: 4, item: 'Hygiene Kits', quantity: 10 }], distributedBy: 'Admin', notes: 'Regular weekly distribution.' },
  { id: 2, date: '2025-02-19', shelterId: 3, shelterName: 'Eastside Family Shelter', items: [{ inventoryId: 3, item: 'Blankets', quantity: 20 }, { inventoryId: 5, item: 'Winter Coats', quantity: 10 }], distributedBy: 'Volunteer Team', notes: 'Emergency delivery due to capacity spike.' },
  { id: 3, date: '2025-02-18', shelterId: 5, shelterName: 'Westside Warming Center', items: [{ inventoryId: 7, item: 'Water Bottles (24pk)', quantity: 15 }, { inventoryId: 8, item: 'Sleeping Bags', quantity: 25 }], distributedBy: 'Admin', notes: 'Cold-weather supply drop.' },
];

const COMMUNITY_MESSAGES = [
  { id: 1, userId: '2', userName: 'Maria S.', avatar: null, message: 'The Downtown Community Center just opened a new nutrition clinic! They offer free dietary assessments every Tuesday.', timestamp: new Date('2025-02-20T14:30:00Z'), likes: 24, replies: 5, category: 'announcement' },
  { id: 2, userId: '3', userName: 'James R.', avatar: null, message: 'Looking for warm clothing donations for the Westside Warming Center. They need coats, gloves, and scarves urgently.', timestamp: new Date('2025-02-20T11:00:00Z'), likes: 47, replies: 12, category: 'request' },
  { id: 3, userId: '4', userName: 'Priya K.', avatar: null, message: 'Volunteer opportunity: Riverside Nutrition Hub needs weekend kitchen helpers this Saturday from 9am to 1pm. DM me if interested!', timestamp: new Date('2025-02-19T16:45:00Z'), likes: 31, replies: 8, category: 'volunteer' },
  { id: 4, userId: '5', userName: 'Carlos M.', avatar: null, message: 'Eastside Family Shelter has availability tonight for families. Capacity is at 90% but they still have room. Call ahead.', timestamp: new Date('2025-02-19T09:20:00Z'), likes: 15, replies: 2, category: 'availability' },
  { id: 5, userId: '1', userName: 'Admin', avatar: null, message: 'System notice: All shelter data is updated in real-time. If you notice outdated information, please use the report button.', timestamp: new Date('2025-02-18T08:00:00Z'), likes: 9, replies: 1, category: 'system' },
];

async function seed() {
  const db = getDb();
  const batch = db.batch();

  const sheltersRef = db.collection('shelters');
  SHELTERS.forEach((s) => batch.set(sheltersRef.doc(String(s.id)), s));

  const inventoryRef = db.collection('inventory');
  INVENTORY.forEach((i) => batch.set(inventoryRef.doc(String(i.id)), i));

  const distRef = db.collection('distributions');
  DISTRIBUTIONS.forEach((d) => batch.set(distRef.doc(String(d.id)), d));

  const communityRef = db.collection('communityMessages');
  COMMUNITY_MESSAGES.forEach((m) => batch.set(communityRef.doc(String(m.id)), m));

  await batch.commit();
  console.log('Seeded: shelters, inventory, distributions, communityMessages');

  const defaultPassword = process.env.SEED_USER_PASSWORD || 'test123';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const usersRef = db.collection('users');

  // Admin user
  const adminSnapshot = await usersRef.where('email', '==', 'admin@nutrilife.app').limit(1).get();
  if (adminSnapshot.empty) {
    await usersRef.add({
      name: 'Admin User',
      email: 'admin@nutrilife.app',
      passwordHash,
      role: 'admin',
      avatar: null,
      joinedAt: new Date(),
      preferences: { needsMeals: true, needsShelter: false, useGPS: true, maxDistance: 5 },
      bookmarks: [1, 2],
      checkIns: [],
    });
    console.log('Created admin user: admin@nutrilife.app /', process.env.ADMIN_PASSWORD || 'admin123');
  } else {
    console.log('Admin user already exists.');
  }

  // Test users for Connect tab (discover members)
  const TEST_USERS = [
    { name: 'Maria Santos', email: 'maria@nutrilife.test', preferences: { needsMeals: true, needsShelter: true, useGPS: true, maxDistance: 3 }, bookmarks: [1, 3] },
    { name: 'James Rowe', email: 'james@nutrilife.test', preferences: { needsMeals: true, needsCounseling: true, requiresVeteran: true, maxDistance: 10 }, bookmarks: [4] },
    { name: 'Priya Sharma', email: 'priya@nutrilife.test', preferences: { needsMeals: true, needsChildcare: true, useGPS: true, maxDistance: 5 }, bookmarks: [1, 2] },
    { name: 'Carlos Mendez', email: 'carlos@nutrilife.test', preferences: { needsShelter: true, needsMedical: false, useGPS: true, maxDistance: 8 }, bookmarks: [2, 5] },
    { name: 'Jordan Taylor', email: 'jordan@nutrilife.test', preferences: { needsMeals: true, requiresPetFriendly: true, useGPS: true, maxDistance: 6 }, bookmarks: [1] },
    { name: 'Sam Chen', email: 'sam@nutrilife.test', preferences: { needsEmployment: true, needsCounseling: true, maxDistance: 15 }, bookmarks: [3, 4] },
  ];

  for (const u of TEST_USERS) {
    const existing = await usersRef.where('email', '==', u.email).limit(1).get();
    if (existing.empty) {
      await usersRef.add({
        name: u.name,
        email: u.email,
        passwordHash,
        role: 'user',
        avatar: null,
        joinedAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000), // random join in last ~6 months
        preferences: u.preferences || {},
        bookmarks: u.bookmarks || [],
        checkIns: [],
      });
      console.log('Created test user:', u.email);
    }
  }
  console.log('Test users ready for Connect tab. Password for all test users:', defaultPassword);
}

seed().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
