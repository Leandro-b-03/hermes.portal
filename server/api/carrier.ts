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
        if (body.action == 'find') {
          const response = await apiCall('POST', '/v1/carrier/find', body);
          return response.carrier;
        } else if (body.action == 'create') {
          const response = await apiCall('POST', '/v1/carrier', body);
          return response.carrier;
        }

      case 'PUT':
        if (body.action == 'update') {
          const response = await apiCall('PUT', `/v1/carrier/${body.carrier.id}`, body);
          return response.carrier;
        }

      // case 'DELETE':

      case 'GET':
        if (query.action == 'collect_carriers') {
          const queries = new URLSearchParams();
          queries.append('page', `${query.page || '1'}`);
          queries.append('per_page', `${query.per_page || '10'}`);
          queries.append('order_by', `${query.order_by || 'desc'}`);
          queries.append('filter', `${query.filter || ''}`);
          queries.append('fields[]', `${query.fields || ''}`);
          
          const response = await apiCall('GET', `/v1/carrier?${queries.toString()}`, { token: query.token});
          return response.carriers;
        } else if (query.action == 'collect_carrier') {
          const response = await apiCall('GET', `/v1/carrier/${query.id}`, { token: query.token });
          return response.carrier;
        } else if (query.action == 'export') {
          const response = await apiCall('GET', `/v1/carrier/export`, { token: query.token }, null, true);
          return response;
        }

      default:
        throw createError({ statusCode: 405, message: 'Method Not Allowed' });
    }
  } catch (error) {
    return error;
  }
});