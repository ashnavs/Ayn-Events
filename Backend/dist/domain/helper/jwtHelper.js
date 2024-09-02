"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jwt = require('jsonwebtoken');
const SECRET_KEY = "YOUR_SECRET_KEY";
const REFRESH_SECRET_KEY = "REFRESH_SECRET_KEY";
const generateToken = (user, email, role) => {
    const token = jwt.sign({ user: user, email: email, role: role }, SECRET_KEY, {
        expiresIn: '2h'
    });
    const refreshToken = jwt.sign({ user: user, email: email, role: role }, REFRESH_SECRET_KEY, {
        expiresIn: '5d',
    });
    return { token, refreshToken };
};
exports.generateToken = generateToken;
