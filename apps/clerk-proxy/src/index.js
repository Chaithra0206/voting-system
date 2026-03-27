export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'frontend-api.clerk.services';

    const headers = new Headers(request.headers);
    headers.set('Host', 'frontend-api.clerk.services');

    // Handle CORS preflight (OPTIONS requests)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': 'https://vote.dk24.org',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Clerk-Session, *',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    // Forward the request to Clerk
    const response = await fetch(url.toString(), {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'follow'
    });

    // Add CORS headers to the response
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', 'https://vote.dk24.org');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Clerk-Session, *');

    return newResponse;
  }
};
