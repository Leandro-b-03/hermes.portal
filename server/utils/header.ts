import jwt from 'jsonwebtoken';

export const authorization = () => {
  const runtimeConfig = useRuntimeConfig();

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const tokenLifetimeInSeconds = 3600; // 1 hour

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  const payload = {
    iss: runtimeConfig.apiGatewayKey, // Issuer
    sub: 'Portal',
    name: 'Portal',
    iat: currentTimeInSeconds, // Issued at (Unix timestamp)
    exp: currentTimeInSeconds + tokenLifetimeInSeconds,  // Expiration time (Unix timestamp)
  };

  const token = jwt.sign(payload, runtimeConfig.apiGatewaySecret, { header });

  return `Bearer ${token}`;
};