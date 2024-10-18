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

// --- Helper functions for each HTTP method ---
async function handlePostRequest(data: any, apiCall: any) {
  if (data.action === 'find') {
    return (await apiCall('POST', '/v1/carrier/find', data)).carrier;
  } else if (data.action === 'create') {
    return (await apiCall('POST', '/v1/carrier', data)).carrier;
  } else if (data.get('action') === 'import_csv') {
    console.log(data);
    return (await apiCall('POST', '/v1/carrier/import', data)).import;
  }
}

async function handlePutRequest(data: any, apiCall: any) {
  if (data.action === 'update') {
    return (await apiCall('PUT', `/v1/carrier/${data.carrier.id}`, data)).carrier;
  }
}

async function handleDeleteRequest(data: any, apiCall: any) {
  if (data.action === 'delete') {
    return (await apiCall('DELETE', `/v1/carrier/${data.id}`, data)).carrier;
  }
}

async function handleGetRequest(data: any, apiCall: any) {
  if (data.action === 'collect_carriers') {
    const queryParams = new URLSearchParams({
      page: data.page || '1',
      per_page: data.per_page || '10',
      order_by: data.order_by || 'desc',
      filter: data.filter || '',
      'fields[]': data.fields || '',
    });
    return (await apiCall('GET', `/v1/carrier?${queryParams}`, { token: data.token })).carriers;

  } else if (data.action === 'collect_carrier') {
    if (!data.id) throw createError({ statusCode: 400, message: 'Missing required parameter: id' });
    const response = (await apiCall('GET', `/v1/carrier/${data.id}`, { token: data.token }));

    if (response.carrier) {
      return response.carrier;
    } else {
      return response.carriers;
    }

  } else if (data.action === 'export') {
    return await apiCall('GET', `/v1/carrier/export`, { token: data.token }, null, true);
  } else if (data.action === 'import_list') {
    if (data.id) {
      return (await apiCall('GET', `/v1/carrier/import/${data.id}`, { token: data.token })).import;
    } else {
      return (await apiCall('GET', `/v1/carrier/import`, { token: data.token })).imports;
    }
  }
}