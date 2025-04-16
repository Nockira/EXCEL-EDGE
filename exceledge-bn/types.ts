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
