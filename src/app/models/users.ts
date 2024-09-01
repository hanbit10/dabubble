export interface Address {
  street?: string;
  city?: string;
}

export interface UserProfile {
  address?: Address;
  email?: string;
  active?: boolean;
  name?: string;
  password?: string;
  profileImage?: string;
  uid: string;
}
