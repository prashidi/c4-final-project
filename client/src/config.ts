// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'th23q6wx35'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-yrfrqow9.auth0.com', // Auth0 domain
  clientId: 'scLKDwJKr7Fh0zd6m0qAHX11OCC2lQHb', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
