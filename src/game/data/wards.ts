import type { WardDefinition } from '../../types/ward';

/** Cycle 7's initial LGA wards. Odo-Ewa remains the original community HQ. */
export const lgaWards: readonly WardDefinition[] = [
  {
    id: 'odo-ewa',
    wardNumber: 1,
    name: 'Odo-Ewa',
    isHeadquarters: true,
    description: 'The original Odo-Ewa community and headquarters of the LGA.',
    agriculturalStrengths: ['cassava', 'vegetables'],
    startingMetrics: { population: 124, foodProduction: 96, foodDemand: 80, employment: 62, health: 68, education: 55, electricityAccess: 48, waterAccess: 70, happiness: 68 },
  },
  {
    id: 'iyetoro',
    wardNumber: 2,
    name: 'Iyetoro',
    isHeadquarters: false,
    description: 'A maize-growing ward with broad, rain-fed fields.',
    agriculturalStrengths: ['maize', 'cassava'],
    startingMetrics: { population: 92, foodProduction: 88, foodDemand: 60, employment: 58, health: 61, education: 49, electricityAccess: 35, waterAccess: 52, happiness: 59 },
  },
  {
    id: 'igbokuta',
    wardNumber: 3,
    name: 'Igbokuta',
    isHeadquarters: false,
    description: 'A rice and wetland farming ward beside the lowlands.',
    agriculturalStrengths: ['rice', 'vegetables'],
    startingMetrics: { population: 76, foodProduction: 102, foodDemand: 50, employment: 67, health: 57, education: 46, electricityAccess: 29, waterAccess: 63, happiness: 56 },
  },
  {
    id: 'oke-aro',
    wardNumber: 4,
    name: 'Oke-Aro',
    isHeadquarters: false,
    description: 'An upland vegetable and smallholder farming ward.',
    agriculturalStrengths: ['vegetables', 'maize'],
    startingMetrics: { population: 64, foodProduction: 54, foodDemand: 42, employment: 51, health: 54, education: 43, electricityAccess: 22, waterAccess: 45, happiness: 52 },
  },
];

export const wardById = (id: WardDefinition['id']) => lgaWards.find((ward) => ward.id === id);
