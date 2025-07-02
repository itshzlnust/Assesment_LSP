import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ success: true, user: userWithoutPassword });

    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}