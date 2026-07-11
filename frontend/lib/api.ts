import { getToken, logout } from './auth';
import type { LeadsResponse, BatchesResponse, ExtractResponse } from '../types/crm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function authHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) {
    logout();
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

function handleUnauthorized(status: number) {
  if (status === 401) {
    logout();
  }
}

export async function processLeads(headers: string[], rows: any[], fileName?: string): Promise<ExtractResponse> {
  const response = await fetch(`${API_URL}/api/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ headers, rows, fileName }),
  });

  if (!response.ok) {
    handleUnauthorized(response.status);
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait and try again.');
    }
    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getLeads(search: string = '', offset: number = 0, limit: number = 50): Promise<LeadsResponse> {
  const query = new URLSearchParams({
    search,
    offset: offset.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_URL}/api/leads?${query.toString()}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw new Error(`Failed to fetch leads: ${response.statusText}`);
  }

  return response.json();
}

export async function getBatches(): Promise<BatchesResponse> {
  const response = await fetch(`${API_URL}/api/batches`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    handleUnauthorized(response.status);
    throw new Error(`Failed to fetch batches: ${response.statusText}`);
  }

  return response.json();
}
