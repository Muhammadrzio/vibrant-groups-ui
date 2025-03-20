
export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  createdAt: string;
  password?: string;
  owner: User;
}

export interface Member {
  id: string;
  user: User;
  group: Group;
}

export interface Item {
  id: string;
  name: string;
  createdAt: string;
  bought: boolean;
  boughtAt?: string;
  boughtBy?: User;
  createdBy: User;
}

export interface AuthResponse {
  user: User;
  token: string;
}
