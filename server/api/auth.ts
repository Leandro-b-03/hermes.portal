import { defineEventHandler, readBody } from 'h3';
import { apiHandler } from '@/server/utils/handler';

export default defineEventHandler(async (event) => {
  const storage = useStorage('redis');
  const { apiCall } = apiHandler(); // Use the apiCall function from the handler

  let body = null;
  let query = null;

  if (event.node.req.method !== 'GET') {
    body = await readBody(event);
  } else {
    query = getQuery(event);
  }

  try {
    switch (event.node.req.method) {
      case 'POST':
        if (body.action == 'sign_in') {
          storage.removeItem(`token_${body.token}`);
          const data = await apiCall('POST', '/v1/login', body);
          return data;
        }

      case 'PUT':

      case 'DELETE':
        if (body.action == 'sign_out') {
          const data = await apiCall('DELETE', '/v1/logout', { token: body.token });
          storage.removeItem(`token_${body.token}`);
          return { message: 'User logged out successfully' };
        }

      case 'GET':
        if (query.action == 'current_user') {
          const data = await apiCall('GET', '/v1/user', { token: query.token});
          return data;
        }

      default:
        throw createError({ statusCode: 405, message: 'Method Not Allowed' });

    }
  } catch (error) {
    return error;
  }
});