const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '112233',
  database: 'district',
});

async function seedAdmin() {
  await client.connect();
  
  const email = 'm2411887@edu.misis.ru';
  const password = 'admin123'; 
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Проверяем, есть ли уже такой пользователь
    const res = await client.query('SELECT id FROM auth_user WHERE email = $1', [email]);
    
    if (res.rows.length > 0) {
      console.log('Админ уже существует!');
    } else {
      await client.query(
        'INSERT INTO auth_user (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Администратор', email, hashedPassword, 'admin']
      );
      console.log('Администратор успешно создан!');
    }
  } catch (err) {
    console.error('Ошибка:', err);
  } finally {
    await client.end();
  }
}

seedAdmin();