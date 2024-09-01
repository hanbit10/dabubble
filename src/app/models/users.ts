export interface Address {
  street?: string;
  city?: string;
}

export interface Name {
  firstName: string;
  lastName: string;
}

export interface UserProfile {
  address?: Address;
  color?: string;
  displayName?: string;
  email: string;
  mainUser: boolean;
  name: Name;
  password: string;
  profileImage?: string;
  uid: string;
}
