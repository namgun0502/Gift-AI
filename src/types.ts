export interface GiftRecommendation {
  title: string;
  category: string;
  priceRange: string;
  reason: string;
  tip: string;
}

export interface CardLetters {
  emotional: string;
  witty: string;
  formal: string;
}

export interface RecommendResponse {
  giftRecommendations: GiftRecommendation[];
  cardLetters: CardLetters;
}

export interface RecommendRequest {
  relationship: string;
  ageGender: string;
  personalityInterests: string;
  occasion: string;
  budget?: string;
  senderName?: string;
  recipientName?: string;
}

export interface SavedCard {
  id: string;
  createdAt: string;
  request: RecommendRequest;
  response: RecommendResponse;
  selectedLetterType: 'emotional' | 'witty' | 'formal';
  cardTheme: string;
}
