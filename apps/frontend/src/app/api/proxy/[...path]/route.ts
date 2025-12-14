import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios, { AxiosError } from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

/**
 * Proxy API Route Handler
 * 
 * This catch-all route proxies all requests to the backend server,
 * forwarding cookies and headers to maintain authentication state.
 * 
 * Benefits:
 * - Keeps httpOnly cookies secure (same-origin)
 * - Backend and frontend can be on different domains
 * - No CORS issues since browser talks to same origin
 * - Maintains separation of concerns
 * 
 * Usage: All API calls go to /api/proxy/* instead of direct backend URL
 */

/**
 * Extracts relevant headers from the incoming request
 * to forward to the backend, excluding hop-by-hop headers
 */
function getForwardHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  
  // Headers to forward
  const headersToForward = [
    'content-type',
    'accept',
    'accept-language',
    'user-agent',
    'authorization', // In case some requests use Bearer tokens directly
  ];

  headersToForward.forEach(header => {
    const value = request.headers.get(header);
    if (value) {
      headers[header] = value;
    }
  });

  return headers;
}

/**
 * Handles GET requests to the proxy
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest('GET', request, resolvedParams.path);
}

/**
 * Handles POST requests to the proxy
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest('POST', request, resolvedParams.path);
}

/**
 * Handles PUT requests to the proxy
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest('PUT', request, resolvedParams.path);
}

/**
 * Handles PATCH requests to the proxy
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest('PATCH', request, resolvedParams.path);
}

/**
 * Handles DELETE requests to the proxy
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest('DELETE', request, resolvedParams.path);
}

/**
 * Core proxy logic that forwards requests to the backend
 */
async function handleProxyRequest(
  method: string,
  request: NextRequest,
  pathSegments: string[]
): Promise<NextResponse> {
  try {
    // Reconstruct the target path
    const targetPath = `/${pathSegments.join('/')}`;
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${BACKEND_URL}${targetPath}${searchParams ? `?${searchParams}` : ''}`;

    // Get cookie store and extract access token
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    // Prepare headers
    const forwardHeaders = getForwardHeaders(request);
    
    // Add Authorization header if we have a token
    if (accessToken) {
      forwardHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    // Get request body for POST/PUT/PATCH
    let requestBody = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        requestBody = await request.json();
      } catch {
        // Body might be empty or not JSON
        requestBody = undefined;
      }
    }

    // Make the proxied request
    const backendResponse = await axios({
      method,
      url: targetUrl,
      headers: forwardHeaders,
      data: requestBody,
      validateStatus: () => true, // Don't throw on any status code
    });

    // Forward the response back to the client
    return NextResponse.json(
      backendResponse.data,
      {
        status: backendResponse.status,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Proxy error:', error);

    // Handle axios errors
    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          message: error.message,
          error: error.response?.data || 'Backend request failed',
        },
        { status: error.response?.status || 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        message: 'Internal proxy error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
