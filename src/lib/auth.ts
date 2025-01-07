interface User {
  username: string;
  password: string;
  role: 'admin' | 'cajero';
}

let users: User[] = [
  { username: 'admin', password: '852456', role: 'admin' },
  { username: 'cajero', password: '1000', role: 'cajero' },
];

export const authenticateUser = (username: string, password: string): User | null => {
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const getAllUsers = (): User[] => {
  return [...users];
};

export const createUser = (newUser: User): void => {
  if (users.some(u => u.username === newUser.username)) {
    throw new Error('Username already exists');
  }
  users.push(newUser);
};

export const updateUser = (username: string, updatedUser: Partial<User>): void => {
  const index = users.findIndex(u => u.username === username);
  if (index === -1) throw new Error('User not found');
  users[index] = { ...users[index], ...updatedUser };
};

export const deleteUser = (username: string): void => {
  const index = users.findIndex(u => u.username === username);
  if (index === -1) throw new Error('User not found');
  users = users.filter(u => u.username !== username);
};