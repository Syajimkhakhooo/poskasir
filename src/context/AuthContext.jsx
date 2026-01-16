import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Email sudah terdaftar');
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after register
        const userSession = { id: newUser.id, name: newUser.name, email: newUser.email };
        setCurrentUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        return newUser;
    };

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Email atau password salah');
        }

        const userSession = { id: user.id, name: user.name, email: user.email };
        setCurrentUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        return user;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ currentUser, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
