import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  allUsers: User[];
  addUser: (newUser: Omit<User, 'id'> & { password?: string }) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial demo users
const INITIAL_USERS = [
  { id: '1', username: 'admina', password: '636360', name: 'Admin User', role: 'admin' as Role },
  { id: '2', username: 'staffa', password: 'password', name: 'Staff User', role: 'staff' as Role },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<(User & { password?: string })[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }

    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        setUsers(INITIAL_USERS);
        localStorage.setItem('app_users', JSON.stringify(INITIAL_USERS));
      }
    } else {
      setUsers(INITIAL_USERS);
      localStorage.setItem('app_users', JSON.stringify(INITIAL_USERS));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const addUser = (newUser: Omit<User, 'id'> & { password?: string }) => {
    const userWithId = { ...newUser, id: Date.now().toString() };
    const updatedUsers = [...users, userWithId];
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (userId: string) => {
    if (userId === '1') return; // Protect main admin
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    
    // If deleted user is current user, logout
    if (user?.id === userId) {
      logout();
    }
  };

  const allUsers = users.map(({ password: _, ...u }) => u);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, allUsers, addUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
