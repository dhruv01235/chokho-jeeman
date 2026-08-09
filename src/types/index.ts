export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF';
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  image?: string | null;
}

export interface Reservation {
  id: string;
  userId: string;
  user?: User;
  date: Date;
  partySize: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
}

export interface QueueItem {
  id: string;
  name: string;
  partySize: number;
  status: 'WAITING' | 'SEATED' | 'CANCELLED';
  estimatedAt: Date;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface FloorTable {
  id: string;
  x: number;
  y: number;
  seats: number;
  status: 'available' | 'reserved' | 'occupied';
}

export interface QueueState {
  items: QueueItem[];
  currentPosition: number;
  estimatedWaitMinutes: number;
  totalAhead: number;
}

export interface AnalyticsData {
  totalReservations: number;
  totalRevenue: number;
  averagePartySize: number;
  peakHours: { hour: number; count: number }[];
  reservationsByStatus: { status: string; count: number }[];
  dailyRevenue: { date: string; revenue: number }[];
}
