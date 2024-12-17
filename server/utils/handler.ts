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

  const apiCall = async (method: string, url: string, data: any = null, header: any = null, blob: boolean = false) => {
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
        delete data.action;
      } else if (data instanceof FormData) { // Check if data is FormData and has a 'token' entry
        if (data.get('token')) {
          data.delete('token');
        }

        data.delete('action');
      }
    }

    try {
      const response = await $fetch.raw(`${runtimeConfig.apiGateway}${url}`, {
        method,
        headers: { ...configHeaders, ...header, Authorization: token },
        body: data,
        responseType: blob ? 'blob' : 'json',
      });

      const body = await response._data;
      
      const token_ = body?.data?.accessToken;

      if (token_) {
        await storage.setItem(`token_${sessionId}`, `Bearer ${token_}`);
      }

      if (blob) {
        return body;
      }

      return body.data;
    } catch (error) {
      console.log("error.response", error.response);
      // Handle errors, including token expiration and 422 validation errors
      if (error.response) {
        const { status, _data: data } = await error.response;
        
        console.log('status', status);
        console.log('data', data);

        throw createError({ 
          statusCode: status || 500, 
          data: data.errors,
          message: 'An unexpected error occurred.' 
        });
      } else {
        // Handle errors without a response object
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
      }
    }
  };

  return { apiCall }; // Return the apiCall function
};