
export interface Recipe {
  id: number;
  title: string;
  image: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  cuisine: 'Italian' | 'Indian' | 'Chinese' | 'Mexican' | 'Continental' | 'Fusion' | 'South Indian';
  ingredients: string;
  steps: string;
  remixNotes: string;
  likes: number;
  isLiked?: boolean;
  saves: number;
  isSaved?: boolean;
  userId?: string;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    requiredIngredients: string[];
    startDate: string; // ISO string
    endDate: string; // ISO string
    status: 'ACTIVE' | 'COMPLETED';
}

export interface Submission {
    id: string;
    challengeId: string;
    recipeId: number;
    userId: string;
    userName: string;
    notes: string;
    createdAt: string; // ISO string
}

export interface Vote {
    submissionId: string;
    userId: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
}

export interface UserBadge {
    userId: string;
    badgeId: string;
    earnedAt: string;
}

export interface Product {
  id: number;
  name: string;
  category: 'Dairy' | 'Bakery' | 'Non-Veg' | 'Seafood' | 'Grains' | 'Fruits' | 'Vegetables';
  image: string;
}

export interface RemixReview {
    id: string;
    recipeId: number;
    reviewerName: string;
    tip: string;
    timestamp: number; // UNIX timestamp
    upvotes: number;
}

export interface SustainableChallengeState {
    currentDay: number;
    completedTasks: number[];
    points: number;
    badges: string[];
    lastAccessDate: string; // ISO string
    pantryItems?: string[];
    reflection?: string;
}