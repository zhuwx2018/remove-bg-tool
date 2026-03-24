export default {
  async fetch(request, env) {
    // 设置 CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
    };

    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // 获取 API Key（优先使用环境变量，否则从请求头获取）
      const apiKey = env.REMOVE_BG_API_KEY || request.headers.get('X-Api-Key');
      
      if (!apiKey) {
        return new Response(JSON.stringify({ errors: [{ title: 'Missing API Key' }] }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 转发请求到 remove.bg
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
};
