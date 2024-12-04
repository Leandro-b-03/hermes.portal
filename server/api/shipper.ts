import { defineEventHandler, readBody, getQuery } from 'h3';
import { apiHandler } from '@/server/utils/handler';

export default defineEventHandler(async (event) => {
  const { apiCall } = apiHandler();
  const method = event.node.req.method;

  const hasFiles = event.node.req.headers['content-type']?.includes('multipart/form-data');

  // Use a single object to hold both body and query parameters
  const data = method === 'GET' ? getQuery(event) : hasFiles ? await readFormData(event) : await readBody(event);

  try {
    switch (method) {
      case 'POST':
        return handlePostRequest(data, apiCall);
      case 'PUT':
        return handlePutRequest(data, apiCall);
      case 'DELETE':
        return handleDeleteRequest(data, apiCall);
      case 'GET':
        return handleGetRequest(data, apiCall);
      default:
        throw createError({ statusCode: 405, message: 'Method Not Allowed' });
    }
  } catch (error) {
    throw error; 
  }
});

async function handlePostRequest(data: any, apiCall: any) {
}

async function handlePutRequest(data: any, apiCall: any) {
  if (data.get('action') === 'update_shipper') {
    return (await apiCall('PUT', `/v1/shipper/${data.get('shipper[id]')}`, data)).shipper;
  }
}

async function handleDeleteRequest(data: any, apiCall: any) {
}

async function handleGetRequest(data: any, apiCall: any) {
  if (data.action === 'get_shipper') {
    return (await apiCall('GET', `/v1/shipper`, { token: data.token })).shipper;
  }
}