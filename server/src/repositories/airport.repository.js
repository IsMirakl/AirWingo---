const db = require('../config/db.config');

async function findAll(){
    const sql = 'SELECT id, name, code, city_id, iata_code, timezone FROM airports ORDER BY name';
    const { rows } = await db.query(sql);
    return rows;
}

async function findById(id) {
    const sql = 'SELECT id, name, cide, city_id, iata_code, timezone FROM airports WHERE id = $1';
    const { rows } = await db.query(sql, [id]);
    return rows[0] || null;
}

async function findByIataCode(iata_code){
    const sql = 'SELECt id, name, code, city_id, timezone FROM airports WHERE iata_code = $1';
    const { rows } = await db.query(sql, [iata_code]);
    return rows[0] || null;
}

module.exports = {
    findAll,
    findById,
    findByIataCode,
};


