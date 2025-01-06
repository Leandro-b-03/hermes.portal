import { defineEventHandler, readBody, getQuery } from 'h3';
import { apiHandler } from '@/server/utils/handler';

export default defineEventHandler(async (event) => {
  const storage = useStorage('redis');
  const { apiCall } = apiHandler();
  const method = event.node.req.method;

  const hasFiles = event.node.req.headers['content-type']?.includes('multipart/form-data');

  // Use a single object to hold both body and query parameters
  const data = method === 'GET' ? getQuery(event) : hasFiles ? await readFormData(event) : await readBody(event);

  console.log(data);

  try {
    switch (method) {
      case 'POST':
        return handlePostRequest(data, apiCall, storage);
      case 'PUT':
        return handlePutRequest(data, apiCall);
      case 'DELETE':
        return handleDeleteRequest(data, apiCall, storage);
      case 'GET':
        return handleGetRequest(data, apiCall);
      default:
        throw createError({ statusCode: 405, message: 'Method Not Allowed' });
    }
  } catch (error) {
    throw error; 
  }
});

async function handlePostRequest(data: any, apiCall: any, storage: any) {
  if (data.action == 'sign_in') {
    storage.removeItem(`token_${data.token}`);
    return await apiCall('POST', '/v1/login', data);
  } else if (data.get('action') == 'sign_up') {
    return (await apiCall('POST', '/v1/auth', data)).user;
  } else if (data.get('action') == 'reset_password') {
    return await apiCall('POST', '/v1/auth/reset_password_l', data);
  }
}

async function handlePutRequest(data: any, apiCall: any) {
}

async function handleDeleteRequest(data: any, apiCall: any, storage: any) {
  if (data.action == 'sign_out') {
    await apiCall('DELETE', '/v1/logout', { token: data.token });
    storage.removeItem(`token_${data.token}`);
    return { message: 'User logged out successfully' };
  }
}

async function handleGetRequest(data: any, apiCall: any) {  
  if (data.action == 'current_user') {
    return await apiCall('GET', '/v1/auth', { token: data.token});
  } else if (data.action === 'verify_sign_up_token') {
    return (await apiCall('GET', `/v1/auth/verify_signup_token?token_code=${data.token_code}`, { token: data.token }));
  }
}