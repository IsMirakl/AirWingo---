const db = require('../config/db.config');

class UserRepository {

  async findByEmail(email) {
    const sql = `
      SELECT u.id, u.email, u.password_hash, u.role, u.created_at,
             p.first_name, p.last_name, p.middle_name, p.date_of_birth
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.email = $1
    `;
    
    const { rows } = await db.query(sql, [email.toLowerCase()]);
    return rows[0] || null;
  }

  async findById(id) {
    const sql = `
      SELECT u.id, u.email, u.role, u.created_at,
             p.first_name, p.last_name, p.middle_name, p.date_of_birth
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `;
    
    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
  }

  async create(userData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      

      const userSql = `
        INSERT INTO users (email, password_hash, role)
        VALUES ($1, $2, $3)
        RETURNING id, email, role, created_at
      `;
      
      const userResult = await client.query(userSql, [
        userData.email.toLowerCase(),
        userData.passwordHash,
        userData.role || 'user'
      ]);
      
      const user = userResult.rows[0];
      

      if (userData.profile) {
        const profileSql = `
          INSERT INTO profiles (user_id, first_name, last_name, middle_name, date_of_birth)
          VALUES ($1, $2, $3, $4, $5)
        `;
        
        await client.query(profileSql, [
          user.id,
          userData.profile.firstName,
          userData.profile.lastName,
          userData.profile.middleName,
          userData.profile.dateOfBirth
        ]);
      }
      
      await client.query('COMMIT');
      return user;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new UserRepository();