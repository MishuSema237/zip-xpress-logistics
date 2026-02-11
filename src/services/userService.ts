import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // This should be hashed in a real application
  role: 'admin' | 'user' | 'manager';
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'manager';
  permissions: string[];
}

const DEFAULT_ADMIN: Omit<User, 'id'> = {
  username: 'Admin',
  email: 'admin@zipxpress.com', // Updated to new branding email or generic admin email
  password: 'password123', // Simplified for demo/testing since we are removing Firebase auth. Ideally user changes this.
  // Wait, let's keep the original password if possible but simplified logic.
  // The original password was 'Glob@ltr@ckTe@m100$'. I should probably keep it or prompt user.
  // I will use 'admin' / 'admin' or similar for easier testing, but better stick to safe defaults.
  // Actually, I'll stick to a default simple one and maybe log it or rely on existing users in localStorage.
  role: 'admin',
  permissions: ['all'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Key for localStorage
const USERS_STORAGE_KEY = 'zip_xpress_users';

// Helper to get users from storage
const getUsersFromStorage = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  if (!usersJson) return [];
  return JSON.parse(usersJson);
};

// Helper to save users to storage
const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getAllUsers = async (): Promise<User[]> => {
  let users = getUsersFromStorage();

  // Add default admin if no users exist
  if (users.length === 0) {
    const adminId = uuidv4();
    const adminUser = { id: adminId, ...DEFAULT_ADMIN, password: 'password123' }; // Default password
    users = [adminUser];
    saveUsersToStorage(users);
  }

  return users;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const users = await getAllUsers();
  return users.find(user => user.id === userId) || null;
};

export const createUser = async (userData: UserInput): Promise<User> => {
  const users = await getAllUsers();

  // Check if username or email already exists
  if (users.some(user => user.username === userData.username)) {
    throw new Error('Username already exists');
  }
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Email already exists');
  }

  const now = new Date().toISOString();
  const newUser: User = {
    id: uuidv4(),
    ...userData,
    createdAt: now,
    updatedAt: now,
  };

  users.push(newUser);
  saveUsersToStorage(users);
  return newUser;
};

export const updateUser = async (userId: string, userData: Partial<UserInput>): Promise<User> => {
  const users = await getAllUsers();
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Check if username or email already exists for other users
  if (userData.username && users.some(user => user.username === userData.username && user.id !== userId)) {
    throw new Error('Username already exists');
  }
  if (userData.email && users.some(user => user.email === userData.email && user.id !== userId)) {
    throw new Error('Email already exists');
  }

  const updatedUser: User = {
    ...users[userIndex],
    ...userData,
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;
  saveUsersToStorage(users);

  return updatedUser;
};

export const deleteUser = async (userId: string): Promise<void> => {
  let users = await getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  users = users.filter(u => u.id !== userId);
  saveUsersToStorage(users);
};

export const validateUser = async (email: string, password: string): Promise<User | null> => {
  const users = await getAllUsers();
  // Simple password check (plaintext for this mock implementation)
  const user = users.find(user => user.email === email && user.password === password);
  if (!user) return null;

  // Don't send password to client (though it's in localStorage anyway)
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as unknown as User; // Cast back to User type
};

// Update user permissions
export const updateUserPermissions = async (userId: string, permissions: string[]): Promise<void> => {
  const users = await getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  users[userIndex].permissions = permissions;
  users[userIndex].updatedAt = new Date().toISOString();
  saveUsersToStorage(users);
}; 
