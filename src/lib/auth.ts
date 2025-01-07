interface User {
  username: string;
  password: string;
  role: 'admin' | 'cajero';
}

const users: User[] = [
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