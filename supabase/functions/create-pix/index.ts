import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CustomerData {
  name: string;
  email: string;
  document: string;
  phone: string;
}

interface TrackingData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  src?: string;
  sck?: string;
}

interface CreatePixRequest {
  planId: string;
  planName: string;
  amount: number;
  customer: CustomerData;
  tracking?: TrackingData;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('PARADISE_API_KEY');
    const productHash = Deno.env.get('PARADISE_PRODUCT_HASH');

    if (!apiKey || !productHash) {
      console.error('Missing API credentials');
      return new Response(
        JSON.stringify({ error: 'Configuração de API ausente' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { planId, planName, amount, customer, tracking }: CreatePixRequest = await req.json();

    console.log('Creating PIX transaction:', { planId, planName, amount, customer, tracking });

    // Validate required fields
    if (!planId || !amount || !customer?.name || !customer?.email || !customer?.document || !customer?.phone) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos. Preencha todos os campos.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique reference
    const reference = `ANITTA-${planId}-${Date.now()}`;

    // Build request body according to Paradise API docs
    const requestBody: Record<string, unknown> = {
      amount: amount, // Already in cents
      description: `Assinatura Anitta Privacy - ${planName}`,
      reference: reference,
      productHash: productHash,
      customer: {
        name: customer.name,
        email: customer.email,
        document: customer.document.replace(/\D/g, ''), // Numbers only
        phone: customer.phone.replace(/\D/g, ''), // Numbers only
      },
    };

    // Add tracking data if provided (UTMs for Utmify integration)
    if (tracking && Object.keys(tracking).some(key => tracking[key as keyof TrackingData])) {
      requestBody.tracking = {
        utm_source: tracking.utm_source || '',
        utm_medium: tracking.utm_medium || '',
        utm_campaign: tracking.utm_campaign || '',
        utm_content: tracking.utm_content || '',
        utm_term: tracking.utm_term || '',
        src: tracking.src || '',
        sck: tracking.sck || '',
      };
      console.log('Tracking data included:', requestBody.tracking);
    }

    // Create transaction with Paradise API
    const response = await fetch('https://multi.paradisepags.com/api/v1/transaction.php', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('Paradise API response:', { status: response.status, data });

    if (!response.ok || data.status === 'error') {
      return new Response(
        JSON.stringify({ error: data.message || 'Erro ao criar transação PIX' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: data.transaction_id,
        reference: data.id || reference,
        qr_code: data.qr_code,
        qr_code_base64: data.qr_code_base64,
        amount: data.amount,
        expires_at: data.expires_at,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating PIX transaction:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
