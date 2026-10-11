export type ItemType = 'found' | 'lost';

export type ItemStatus = 'available' | 'verifying' | 'returned';

export interface ChatMessage {
  id: string;
  senderRole: 'finder' | 'claimant';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ClaimRequest {
  id: string;
  itemId: string;
  claimantName: string;
  claimantCity: string;
  claimantContact: string;
  answers: string[];
  extraSpecs: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  messages: ChatMessage[];
}

export interface FoundItem {
  id: string;
  type: ItemType;
  title: string;
  category: string;
  city: string;
  neighborhood: string;
  dateFound: string;
  publicDescription: string;
  imageUrl: string;
  finderName: string;
  finderPhone: string;
  verificationQuestions: string[];
  secretHintNote?: string;
  status: ItemStatus;
  createdAt: string;
  claims: ClaimRequest[];
}
