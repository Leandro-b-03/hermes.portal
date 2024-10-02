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
      // case 'POST':

      // case 'PUT':

      // case 'DELETE':

      case 'GET':
        if (query.action == 'collect_carriers') {
          const queries = new URLSearchParams();
          queries.append('page', `${query.page || '1'}`);
          queries.append('per_page', `${query.per_page || '10'}`);
          queries.append('order_by', `${query.order_by || 'desc'}`);
          queries.append('filter', `${query.filter || ''}`);
          queries.append('fields[]', `${query.fields || ''}`);
          
          const data = await apiCall('GET', `/v1/carrier?${queries.toString()}`, { token: query.token});
          return data.carriers;
        }

      default:
        throw createError({ statusCode: 405, message: 'Method Not Allowed' });
    }
  } catch (error) {
    return error;
  }
});