import { Timestamp } from 'firebase/firestore';

export interface Asset {
  id: string;
  name: string;
  description: string;
  location?: string;
  attachments?: string[];
  createdAt?: Timestamp;
}
