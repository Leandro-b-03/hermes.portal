import { authorization } from "./header";

export const apiHandler = () => {
  const runtimeConfig = useRuntimeConfig();
  const storage = useStorage('redis'); 
  const configHeaders = {
    "Subscription": "GgUeHf6XwsHcxbHRJmTlI1vFaFUMtBPS",
    "Origin": 'http://portal:5173',
    "K_Authorization": authorization(),
    "User-Agent": "Hermes/1.0.0",
    "Accept": "application/json",
  };

  const apiCall = async (method: string, url: string, data: any = null, header: any = null) => {
    let sessionId = null;

    if (data.token != null && data.token != undefined && data.token != '' && data.token != 'null') {
      if (data.token) {
        sessionId = data.token;
      }
    } else if (data instanceof FormData) {
      if (data.get('token') != null && data.get('token') != undefined && data.get('token') != '') {
        sessionId = data.get('token');
      }
    }

    let token = null;
    
    if (sessionId) {
      token = await storage.getItem(`token_${sessionId}`);
    }

    if (method === 'GET' && data) {
      data = null; 
    } else {
      if (method !== 'GET' && data.token) { // Check if data is an object and has a 'token' property
        delete data.token;
      } else if (data instanceof FormData && data.get('token')) { // Check if data is FormData and has a 'token' entry
        data.delete('token');
      }
    }

    try {
      const response = await $fetch.raw(`${runtimeConfig.apiGateway}${url}`, {
        method,
        headers: { ...configHeaders, ...header, Authorization: token },
        body: data,
      });

      const body = await response._data;
      
      const token_ = body?.data?.accessToken;

      if (token_) {
        await storage.setItem(`token_${sessionId}`, `Bearer ${token_}`);
      }

      return body.data;
    } catch (error) {
      console.log('error', error.response);
      // Handle errors, including token expiration and 422 validation errors
      if (error.response && error.response.status === 401) {
        const data = await error.response._data;
        throw createError({ statusCode: 401, message: data.messages,  });
      }

      if (error.response && error.response.status === 422) {
        const data = await error.response._data;
        throw createError({ statusCode: 422, message: data.messages });
      }

      if (error.response && error.response.status === 403) {
        const data = await error.response._data;
        throw createError({ statusCode: 403, message: data.messages });
      }

      if (error.response && error.response.status === 404) {
        const data = await error.response._data;
        throw createError({ statusCode: 404, message: data.messages });
      }

      // Handle other errors or retry if token has expired (similar to your Axios interceptor)
      // if (error.response && error.response.status === 403) {
      //   const newToken = await refreshToken();
      //   storage.setItem('auth', newToken);
      //   return apiCall(method, url, data);
      // }

      throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
  };

  return { apiCall }; // Return the apiCall function
};