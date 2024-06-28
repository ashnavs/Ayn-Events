
const jwt = require ('jsonwebtoken')
const SECRET_KEY = "YOUR_SECRET_KEY"; 

export const generateToken = (user: string, email: string): string => {
    return jwt.sign({user: user, email: email }, SECRET_KEY, {
        expiresIn: '1h'
    });
};


export const generateTokenVendor = (vendor: string, email: string): string => {
    return jwt.sign({ vendor: vendor, email: email }, SECRET_KEY, {
        expiresIn: '1h'
    });
};
export const verifyToken = (token: string): any => {
    return jwt.verify(token, SECRET_KEY);
};
