'use client'

'use server'

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { sql } from '@vercel/postgres'

type LoginResult = {
  success: boolean
  message: string
}

type User = {
  id: number
  username: string
  password: string
}

export async function login(formData: FormData): Promise<LoginResult> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { 
      success: false, 
      message: 'Username and password are required' 
    }
  }

  try {
    // Fetch user from database
    const result = await sql<User>`
      SELECT * FROM users WHERE username = ${username}
    `
    const user = result.rows[0]

    if (!user) {
      return { 
        success: false, 
        message: 'Invalid username or password' 
      }
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return { 
        success: false, 
        message: 'Invalid username or password' 
      }
    }

    // Set a cookie to simulate a session
    cookies().set('user', user.id.toString(), { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    return { 
      success: true, 
      message: 'Login successful' 
    }
  } catch (error) {
    console.error('Login error:', error)
    return { 
      success: false, 
      message: 'An error occurred during login' 
    }
  }
}

export async function logout(): Promise<void> {
  cookies().delete('user')
}

export async function getUser(): Promise<User | null> {
  const userId = cookies().get('user')?.value
  if (!userId) return null

  try {
    const result = await sql<User>`
      SELECT id, username FROM users WHERE id = ${parseInt(userId, 10)}
    `
    return result.rows[0] || null
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export async function register(formData: FormData): Promise<LoginResult> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { 
      success: false, 
      message: 'Username and password are required' 
    }
  }

  try {
    // Check if user already exists
    const existingUser = await sql<User>`
      SELECT * FROM users WHERE username = ${username}
    `

    if (existingUser.rows.length > 0) {
      return { 
        success: false, 
        message: 'Username already exists' 
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert new user
    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword})
    `

    return { 
      success: true, 
      message: 'User registered successfully' 
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { 
      success: false, 
      message: 'An error occurred during registration' 
    }
  }
}