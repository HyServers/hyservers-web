import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjsjs';
import { ADMIN_TOKEN, JWT_SECRET } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '7d';

export async function verifyPassword(password: string): Promise<boolean> {
	if (!ADMIN_TOKEN) {
		return false;
	}
	return bcrypt.compare(password, ADMIN_TOKEN);
}

export function createToken(): string {
	return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): boolean {
	try {
		jwt.verify(token, JWT_SECRET);
		return true;
	} catch {
		return false;
	}
}

export function setAuthCookie(cookies: Cookies): void {
	const token = createToken();
	cookies.set(COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});
}

export function clearAuthCookie(cookies: Cookies): void {
	cookies.delete(COOKIE_NAME, { path: '/' });
}

export function isAuthenticated(cookies: Cookies): boolean {
	const token = cookies.get(COOKIE_NAME);
	if (!token) {
		return false;
	}
	return verifyToken(token);
}
