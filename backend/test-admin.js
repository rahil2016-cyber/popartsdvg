
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function test() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'popartsdvg',
  });

  const [admins] = await connection.query('SELECT * FROM admins');
  console.log('Admins in DB:', admins);

  if (admins.length > 0) {
    const admin = admins[0];
    const testPass = 'admin123';
    const match = await bcrypt.compare(testPass, admin.password);
    console.log('Password matches admin123:', match);
  }

  await connection.end();
}
test();
