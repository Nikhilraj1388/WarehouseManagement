export enum Role { ADMIN = 'ADMIN', SALES = 'SALES', WAREHOUSE = 'WAREHOUSE', ACCOUNTS = 'ACCOUNTS' }
export enum CustomerType { RETAIL = 'RETAIL', WHOLESALE = 'WHOLESALE', DISTRIBUTOR = 'DISTRIBUTOR' }
export enum CustomerStatus { LEAD = 'LEAD', ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }
export enum MovementType { IN = 'IN', OUT = 'OUT' }
export enum ChallanStatus { DRAFT = 'DRAFT', CONFIRMED = 'CONFIRMED', CANCELLED = 'CANCELLED' }

export interface User { id: string; name: string; email: string; role: Role; }
export interface Customer { id: string; customerName: string; mobile: string; email?: string; businessName?: string; gstNumber?: string; customerType: CustomerType; address?: string; status: CustomerStatus; followUpDate?: string; notes?: string; createdAt: string; updatedAt: string; }
export interface FollowUp { id: string; customerId: string; note: string; createdBy: string; createdAt: string; creator?: User; }
export interface Product { id: string; name: string; sku: string; category: string; unitPrice: number; currentStock: number; minimumStock: number; warehouseLocation?: string; createdAt: string; updatedAt: string; }
export interface StockMovement { id: string; productId: string; quantity: number; movementType: MovementType; reason: string; createdBy: string; createdAt: string; creator?: User; product?: Product; }
export interface Challan { id: string; challanNumber: string; customerId: string; totalQuantity: number; status: ChallanStatus; createdBy: string; createdAt: string; updatedAt: string; customer?: Customer; creator?: User; items?: ChallanItem[]; }
export interface ChallanItem { id: string; challanId: string; productId: string; productName: string; sku: string; unitPrice: number; quantity: number; }
export interface DashboardStats { totalCustomers: number; activeCustomers: number; totalProducts: number; lowStockProducts: number; totalChallans: number; recentChallans: Challan[]; upcomingFollowUps: (Customer & { followUps: FollowUp[] })[]; }
export interface PaginatedResponse<T> { data: T[]; page: number; limit: number; total: number; }
export interface ApiResponse<T> { success: boolean; data?: T; message?: string; }
