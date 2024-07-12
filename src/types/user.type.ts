export interface Authority {
    authority: string;
}

export interface User {
    usersID: number;
    accountName: string;
    email: string;
    password: string;
    phone: string;
    address: string | null;
    rate: number;
    userWallet: number;
    userStatus: boolean;
    role: Role;
    coverImages: string | null;
    verificationCode: string | null;
    enabled: boolean;
    cart: any[]; // Chưa có thông tin chi tiết về cấu trúc của cart
    rankMember: string | null;
    username: string;
    authorities: Authority[];
    credentialsNonExpired: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
}
export interface UserToken {
    usersID: number;
    accountName: string;
    email: string;
    password: string;
    phone: string;
    address: string | null;
    rate: number;
    userWallet: number;
    userStatus: boolean;
    role: string;
    verificationCode: string | null;
    enabled: boolean;
    cart: any[]; // Chưa có thông tin chi tiết về cấu trúc của cart
    rankMember: string | null;
    username: string;
    authorities: Authority[];
    credentialsNonExpired: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
}

export type Role = 'ADMIN' | 'SHOP' | 'SUPPER_ADMIN'; // hoặc định nghĩa chi tiết hơn nếu cần
