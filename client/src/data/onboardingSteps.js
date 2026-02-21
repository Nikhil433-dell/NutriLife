export const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Welcome to NutriLife',
    description:
      'We help connect people to nearby shelters, food resources, and community support. Let's personalize your experience.',
    icon: '🏠',
    fields: [],
  },
  {
    id: 2,
    title: 'Your Needs',
    description: 'Tell us what you're looking for so we can show you the most relevant resources.',
    icon: '🎯',
    fields: [
      { key: 'needsMeals', label: 'Meals & Nutrition', type: 'checkbox' },
      { key: 'needsShelter', label: 'Overnight Shelter', type: 'checkbox' },
      { key: 'needsMedical', label: 'Medical Assistance', type: 'checkbox' },
      { key: 'needsCounseling', label: 'Counseling & Mental Health', type: 'checkbox' },
      { key: 'needsChildcare', label: 'Childcare Support', type: 'checkbox' },
      { key: 'needsEmployment', label: 'Employment Resources', type: 'checkbox' },
    ],
  },
  {
    id: 3,
    title: 'Accessibility',
    description: 'Let us know about any accessibility requirements so we can filter results for you.',
    icon: '♿',
    fields: [
      { key: 'requiresWheelchair', label: 'Wheelchair Accessible', type: 'checkbox' },
      { key: 'requiresPetFriendly', label: 'Pet-Friendly Facilities', type: 'checkbox' },
      { key: 'requiresFamily', label: 'Family-Friendly', type: 'checkbox' },
      { key: 'requiresVeteran', label: 'Veterans Services', type: 'checkbox' },
    ],
  },
  {
    id: 4,
    title: 'Location Preferences',
    description: 'Allow location access to show you the closest available resources.',
    icon: '📍',
    fields: [
      { key: 'useGPS', label: 'Use my current location', type: 'checkbox' },
      { key: 'maxDistance', label: 'Maximum distance (miles)', type: 'range', min: 1, max: 20, step: 1 },
    ],
  },
  {
    id: 5,
    title: 'You're All Set!',
    description:
      'Your profile is ready. We'll show you personalized shelter and nutrition resources based on your preferences.',
    icon: '✅',
    fields: [],
  },
];
