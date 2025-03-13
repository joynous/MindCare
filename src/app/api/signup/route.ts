import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { fullname,username,email, password } = await request.json();
    if (!fullname || !username || !email || !password) {
      return NextResponse.json(
        { message: 'Name, Username , Email and password are required' },
        { status: 400 }
      );
    }

    if (fullname.length<5) {
        return NextResponse.json(
          { message: 'Name must be atleast 5 letters long' },
          { status: 400 }
        );
      }

    const client = await clientPromise;
    const db = client.db('test');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.collection('users').insertOne({
        personal_info: {
          email,
          username,
          fullname,
          password: hashedPassword,
        }
      });
      

    return NextResponse.json(
      { message: 'User created!', userId: user.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}