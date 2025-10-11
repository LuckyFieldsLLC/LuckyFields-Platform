import type { Handler } from '@netlify/functions';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
} as const;

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: { ...CORS },
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...CORS },
      body: 'Method Not Allowed',
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', ...CORS },
    body: JSON.stringify({ ok: true, timestamp: new Date().toISOString() }),
  };
};
