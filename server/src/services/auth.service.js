const userRepository = require('../repositories/user.repositories');
const AuthUtils = require('../utils/jwt.utils');
const ApiError = require('../utils/ApiError');

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const passwordHash = await AuthUtils.hashPassword(userData.password);

    const newUser = await userRepository.create({
      email: userData.email,
      passwordHash: passwordHash,
      role: userData.role || 'user',
      profile: userData.profile,
    });

    const token = AuthUtils.generatedJwtToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await AuthUtils.comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = AuthUtils.generatedJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      middleName: user.middle_name,
      dateOfBirth: user.date_of_birth,
      role: user.role,
      createdAt: user.created_at,
    };
  }
}

module.exports = new AuthService();
