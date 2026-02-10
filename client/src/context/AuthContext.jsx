/**
 * Mobile: Frontend / Authentication
 * Description: Context provider for managing global authentication state.
 * Handles user login, registration, logout, and token persistence.
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Effect to initialize auth state from local storage on mount
    useEffect(() => {
        if (token) {
            // Set default auth header for all axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // optionally fetch user profile here to verify token
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    // Login function: authenticates user and stores token/user data
    const login = async (email, password) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/auth/login`, { email, password });
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    };

    // Register function: creates a new user account
    const register = async (email, password, role) => {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/auth/register`, { email, password, role });
    };

    // Logout function: clears auth state and local storage
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to consume auth context
export const useAuth = () => useContext(AuthContext);
