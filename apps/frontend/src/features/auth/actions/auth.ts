'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

/**
 * Method to get the current user from the backend using the stored auth token.
 * Normalmente, el backend Nest expone un endpoint protegido (GET /users/me) que 
 * devuelve los datos del usuario basándose en el token JWT
 * 
export async function getCurrentUser() {
   const token = await getAuthToken();
   if (!token) {
      return null;
   }
   try {
      
   } catch (error) {

   }
}

*/

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server action to login with email and password
 * Sets httpOnly cookie on success and redirects to dashboard
 */
export async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    // Call backend login endpoint
    const response = await axios.post(`${BACKEND_URL}/auth/login`, credentials);
    const { accessToken } = response.data;

    console.log('Login successful, received token');

    // Validate token with backend
    try {
      console.log('Validating token with backend...');
      const meResponse = await axios.get(`${BACKEND_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Token validation successful:', meResponse.data);
    } catch (error: any) {
      console.error('Token validation failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      return {
        success: false,
        error: `Token validation failed: ${error.response?.data?.message || error.message}`,
      };
    }

    // Set httpOnly cookie con sameSite='none' para cross-site
    console.log('Setting cookie...');
    const cookiesStore = await cookies();
    cookiesStore.set({
      name: 'access_token',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'lax' en desarrollo, 'none' en producción
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    console.log('Cookie set successfully');

    console.log('Returning success response');
    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error response:', error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || 'Invalid credentials',
    };
  }
}

/**
 * Server action to register a new user
 * Sets httpOnly cookie on success and redirects to dashboard
 */
export async function registerWithCredentials(
  data: RegisterData
): Promise<AuthResponse> {
  try {
    // Call backend register endpoint
    const response = await axios.post(`${BACKEND_URL}/auth/register`, data);
    const { accessToken } = response.data;

    // Set httpOnly cookie con sameSite='none' para cross-site
    const cookiesStore = await cookies();
    cookiesStore.set({
      name: 'access_token',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'lax' en desarrollo, 'none' en producción
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return {
      success: true,
      message: 'Registration successful',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  redirect('/');
}
