const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = new User({ email, password, role });
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret');
        res.status(201).json({ user, token });
    } catch (e) {
        console.error('Registration error:', e);
        res.status(400).json({ error: e.message || 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ error: 'Login failed! Check authentication credentials' });
        }

        console.log('User found:', user.email, 'Role:', user.role, 'Locked:', user.isLocked);

        if (user.isLocked) {
            return res.status(403).json({ error: 'Account is locked. Please contact admin.' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        console.log('Password match result:', isPasswordMatch);

        if (!isPasswordMatch) {
            user.failedAttempts += 1;
            if (user.role === 'admin' && user.failedAttempts >= 5) {
                user.isLocked = true;
                console.log('Account locked due to too many failed attempts:', email);
            }
            await user.save();
            return res.status(401).json({ error: 'Login failed! Check authentication credentials' });
        }

        user.failedAttempts = 0;
        await user.save();

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '2h' });
        res.json({ user: { _id: user._id, email: user.email, role: user.role }, token });
    } catch (e) {
        console.error('Login error:', e);
        res.status(400).json({ error: e.message || 'Login failed' });
    }
};

exports.logout = async (req, res) => {
    try {
        res.json({ message: 'Logged out successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
