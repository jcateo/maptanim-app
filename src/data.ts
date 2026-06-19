import { Crop, Disease } from './types';

export const CROPS: Record<string, Crop> = {
  'tomato': {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    suitableSoils: ['Loam', 'Sandy', 'Silty'],
    seasons: ['Dry Season', 'Year-Round'],
    growthHabit: 'Bushy vine',
    imageUrl: '🍅',
    plantingMethod: {
      methods: [
        {
          name: 'Direct Seeding',
          steps: ['Prepare soil', 'Make furrows', 'Place seeds 2cm deep', 'Water regularly'],
        },
        {
          name: 'Transplanting',
          steps: ['Raise seedlings', 'Prepare main field', 'Transplant 4-6 weeks old seedlings', 'Space 45cm apart'],
        },
      ],
      spacing: '45cm x 45cm',
      depth: '2-3cm',
    },
    supportStructure: {
      description: 'Tomatoes need support for better yield and disease management',
      materials: ['Bamboo sticks', 'Rope', 'Wire'],
      steps: ['Insert stakes at planting', 'Tie plants at 4-week intervals', 'Remove lower leaves'],
    },
    nutrientNeeds: {
      n: '150-200 kg/ha',
      p: '60-90 kg/ha',
      k: '120-180 kg/ha',
      bestFertilizer: 'NPK 10:26:26',
      deficiencies: ['Early Blight', 'Late Blight', 'Fusarium Wilt'],
      remedy: 'Apply fungicides, remove affected leaves, improve drainage',
    },
    daysToHarvest: 70,
  },
  'maize': {
    id: 'maize',
    name: 'Maize (Corn)',
    scientificName: 'Zea mays',
    suitableSoils: ['Loam', 'Silty'],
    seasons: ['Wet Season', 'Year-Round'],
    growthHabit: 'Tall grass',
    imageUrl: '🌽',
    plantingMethod: {
      methods: [
        {
          name: 'Direct Seeding',
          steps: ['Open furrows', 'Place 2-3 seeds per hole', 'Space 75cm x 25cm', 'Thin to 1 plant after germination'],
        },
      ],
      spacing: '75cm x 25cm',
      depth: '5cm',
    },
    supportStructure: {
      description: 'Maize typically does not require support structures',
    },
    nutrientNeeds: {
      n: '120-150 kg/ha',
      p: '60-90 kg/ha',
      k: '40-60 kg/ha',
      bestFertilizer: 'Urea and DAP',
      deficiencies: ['Corn Rust', 'Fall Armyworm'],
      remedy: 'Use resistant varieties, apply insecticides for armyworm',
    },
    daysToHarvest: 120,
  },
  'beans': {
    id: 'beans',
    name: 'Beans',
    scientificName: 'Phaseolus vulgaris',
    suitableSoils: ['Loam', 'Sandy', 'Silty'],
    seasons: ['Wet Season', 'Dry Season'],
    growthHabit: 'Bushy or climbing',
    imageUrl: '🫘',
    plantingMethod: {
      methods: [
        {
          name: 'Direct Seeding',
          steps: ['Prepare soil', 'Make planting holes', 'Place 2-3 seeds per hole', 'Space 30cm x 20cm'],
        },
      ],
      spacing: '30cm x 20cm',
      depth: '3-4cm',
    },
    supportStructure: {
      description: 'Climbing beans need trellises or poles for support',
      materials: ['Bamboo poles', 'Wire', 'Strings'],
      steps: ['Install support structure at planting', 'Guide vines as they grow'],
    },
    nutrientNeeds: {
      n: '40-60 kg/ha',
      p: '60-90 kg/ha',
      k: '60-90 kg/ha',
      bestFertilizer: 'NPK 0:17:17 or compost',
      deficiencies: ['Bean Rust', 'Angular Leaf Spot'],
      remedy: 'Practice crop rotation, apply fungicides, use resistant varieties',
    },
    daysToHarvest: 60,
  },
  'cabbage': {
    id: 'cabbage',
    name: 'Cabbage',
    scientificName: 'Brassica oleracea',
    suitableSoils: ['Loam', 'Clay', 'Silty'],
    seasons: ['Cool Season'],
    growthHabit: 'Head forming',
    imageUrl: '🥬',
    plantingMethod: {
      methods: [
        {
          name: 'Transplanting',
          steps: ['Raise seedlings in nursery', 'Prepare field with organic matter', 'Transplant 4-5 weeks old seedlings', 'Space 45cm x 45cm'],
        },
      ],
      spacing: '45cm x 45cm',
      depth: 'Transplant only',
    },
    nutrientNeeds: {
      n: '150-200 kg/ha',
      p: '60-90 kg/ha',
      k: '90-120 kg/ha',
      bestFertilizer: 'NPK 10:10:10 with zinc',
      deficiencies: ['Cabbage Moth', 'Leaf Spot'],
      remedy: 'Use nets, apply organic pesticides, practice crop rotation',
    },
    daysToHarvest: 90,
  },
  'carrot': {
    id: 'carrot',
    name: 'Carrot',
    scientificName: 'Daucus carota',
    suitableSoils: ['Sandy', 'Loam'],
    seasons: ['Cool Season', 'Year-Round'],
    growthHabit: 'Root vegetable',
    imageUrl: '🥕',
    plantingMethod: {
      methods: [
        {
          name: 'Direct Seeding',
          steps: ['Prepare loose, weed-free soil', 'Sow seeds thinly', 'Keep soil moist', 'Thin seedlings to 5-7cm apart'],
        },
      ],
      spacing: '20cm rows, 5-7cm in row',
      depth: '1-2cm',
    },
    nutrientNeeds: {
      n: '80-100 kg/ha',
      p: '60-80 kg/ha',
      k: '150-200 kg/ha',
      bestFertilizer: 'Potassium rich fertilizer',
      deficiencies: ['Carrot Fly', 'Leaf Blight'],
      remedy: 'Use row covers, apply neem oil, remove affected leaves',
    },
    daysToHarvest: 70,
  },
};

export const DISEASES: Record<string, Disease> = {
  'early_blight': {
    name: 'Early Blight',
    symptoms: ['Brown spots with concentric rings', 'Affects lower leaves first', 'Yellow halo around spots'],
    prevention: ['Remove lower leaves', 'Improve air circulation', 'Use resistant varieties'],
    solutions: ['Apply mancozeb fungicide', 'Remove affected leaves', 'Space plants properly'],
    affectedCrops: ['tomato'],
  },
  'late_blight': {
    name: 'Late Blight',
    symptoms: ['Water-soaked spots', 'White powder on leaf underside', 'Spreads rapidly in wet conditions'],
    prevention: ['Avoid overhead watering', 'Use resistant varieties', 'Rotate crops'],
    solutions: ['Apply copper fungicide', 'Improve drainage', 'Remove affected plant parts'],
    affectedCrops: ['tomato'],
  },
  'fusarium_wilt': {
    name: 'Fusarium Wilt',
    symptoms: ['Wilting on one side', 'Yellow discoloration', 'Brown vascular tissue'],
    prevention: ['Use resistant varieties', 'Practice crop rotation', 'Avoid contaminated soil'],
    solutions: ['Remove affected plants', 'Soil solarization', 'Use clean planting material'],
    affectedCrops: ['tomato'],
  },
};
