export interface Asset {
  id: string;
  name: string;
  description: string;
  location?: string;
  attachments?: string[];
  createdAt?: any;
}