import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CustomerData {
  email: string;
  phone: string;
}

interface CreatePixRequest {
  planId: string;
  planName: string;
  amount: number;
  customer: CustomerData;
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

    const { planId, planName, amount, customer }: CreatePixRequest = await req.json();

    console.log('Creating PIX transaction:', { planId, planName, amount, customer });

    // Validate required fields
    if (!planId || !amount || !customer?.email || !customer?.phone) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos. Preencha todos os campos.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique reference
    const reference = `ANITTA-${planId}-${Date.now()}`;

    // Create transaction with Paradise API
    const response = await fetch('https://multi.paradisepags.com/api/v1/transaction.php', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount, // Already in cents
        description: `Assinatura Anitta Privacy - ${planName}`,
        reference: reference,
        productHash: productHash,
        customer: {
          name: customer.email.split('@')[0], // Use email prefix as name
          email: customer.email,
          document: '00000000000', // Placeholder - API requires it
          phone: customer.phone.replace(/\D/g, ''), // Numbers only
        },
      }),
    });

    const data = await response.json();
    console.log('Paradise API response:', { status: response.status, data });

    if (!response.ok) {
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
