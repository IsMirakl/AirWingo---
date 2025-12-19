const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';


class AuthUtils {
    static generatedJwtToken(payload){
        return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
    }

    static verifyJwtToken(token){
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    static async hashPassword(password){
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    static async comparePassword(password, hash){
        return await bcrypt.compare(password, hash);
    }
}

module.exports = AuthUtils;
