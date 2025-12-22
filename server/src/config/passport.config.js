const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const userRepository = require('../repositories/user.repositories');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'mysecretpasswordfortoken123!@#$%ASDFGHJKL',
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await userRepository.findById(payload.userId);

      if (user) {
        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
