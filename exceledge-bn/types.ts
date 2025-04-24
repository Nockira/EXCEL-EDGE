export interface IRegisterUser {
  id?: string;
  firstName?: string;
  secondName?: string;
  email: string;
  phone?: string;
  role?: string;
  password: string;
  gender?: string;
  dob?: Date;
}
export interface ILogin {
  email?: string;
  phone?: string;
  password: string;
}
export interface CreateBookInput {
  title: string;
  author: string;
  language: string;
  coverImageUrl?: string | null;
  pdfUrl?: string | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
  creatorId: string;
}
export interface UpdateBookInput {
  title?: string;
  author?: string;
  language?: string;
  coverImageUrl?: string | null;
  pdfUrl?: string | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
}
export type ServiceType = "TIN_MANAGEMENT" | "GOOGLE_LOCATION" | "BOOKS";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  method: string;
  duration: number;
  service: ServiceType;
  status: TransactionStatus;
  remainingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionStatus {
  isActive: boolean;
  remainingDays: number;
  expiresAt: Date | null;
}
