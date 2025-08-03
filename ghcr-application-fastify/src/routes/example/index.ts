import { FastifyPluginAsync } from 'fastify'
import mysql from 'mysql2/promise'

interface User {
  id?: number
  name: string
  email: string
  age?: number
}

const createConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

const initDatabase = async () => {
  const connection = await createConnection()
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        age INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('Users table created or already exists')
  } catch (error) {
    console.error('Error creating users table:', error)
  } finally {
    await connection.end()
  }
}

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  
  await initDatabase()
  
  fastify.post('/users', async function (request, reply) {
    const { name, email, age } = request.body as User
    
    const connection = await createConnection()
    try {
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
        [name, email, age]
      )
      return { success: true, id: (result as any).insertId }
    } catch (error) {
      reply.code(500)
      return { error: 'Failed to create user' }
    } finally {
      await connection.end()
    }
  })

  fastify.get('/users', async function (request, reply) {
    const connection = await createConnection()
    try {
      const [rows] = await connection.execute('SELECT * FROM users')
      return { users: rows }
    } catch (error) {
      console.log('Error fetching users:', error);
      
      reply.code(500)
      return { error: 'Failed to fetch users' }
    } finally {
      await connection.end()
    }
  })

  fastify.get('/users/:id', async function (request, reply) {
    const { id } = request.params as { id: string }
    
    const connection = await createConnection()
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id])
      const users = rows as User[]
      if (users.length === 0) {
        reply.code(404)
        return { error: 'User not found' }
      }
      return { user: users[0] }
    } catch (error) {
      reply.code(500)
      return { error: 'Failed to fetch user' }
    } finally {
      await connection.end()
    }
  })

  fastify.put('/users/:id', async function (request, reply) {
    const { id } = request.params as { id: string }
    const { name, email, age } = request.body as User
    
    const connection = await createConnection()
    try {
      const [result] = await connection.execute(
        'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
        [name, email, age, id]
      )
      if ((result as any).affectedRows === 0) {
        reply.code(404)
        return { error: 'User not found' }
      }
      return { success: true }
    } catch (error) {
      reply.code(500)
      return { error: 'Failed to update user' }
    } finally {
      await connection.end()
    }
  })

  fastify.delete('/users/:id', async function (request, reply) {
    const { id } = request.params as { id: string }
    
    const connection = await createConnection()
    try {
      const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id])
      if ((result as any).affectedRows === 0) {
        reply.code(404)
        return { error: 'User not found' }
      }
      return { success: true }
    } catch (error) {
      reply.code(500)
      return { error: 'Failed to delete user' }
    } finally {
      await connection.end()
    }
  })
}

export default example
