export async function onRequestPost({ request, env }) {
  return handler(request, env);
}

export async function onRequest({ request, env }) {
  return handler(request, env);
}

async function handler(request, env) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const apiKey = 'yLWVD4C1RuDLkwPinHNUiV37';
    
    if (!apiKey) {
      return new Response(JSON.stringify({ errors: [{ title: 'Missing API Key' }] }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey
      },
      body: formData
    });

    const data = await response.arrayBuffer();
    
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'image/png'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ errors: [{ title: error.message }] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
