import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const getSeedUsers = () => [
  {
    name: process.env.ADMIN_NAME || 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@email.com',
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || '123456', 10),
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
  },
  {
    name: 'Jane Doe',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
  },
];

export default getSeedUsers;
