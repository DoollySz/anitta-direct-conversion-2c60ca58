import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  tracking?: TrackingData;
}

// ---- Random valid data generators ----

const firstNames = [
  "Ana", "Maria", "João", "Pedro", "Lucas", "Juliana", "Fernanda", "Carlos",
  "Rafael", "Mariana", "Gabriel", "Beatriz", "Bruno", "Camila", "Diego",
  "Larissa", "Felipe", "Amanda", "Rodrigo", "Patricia", "Gustavo", "Leticia",
  "Thiago", "Vanessa", "Leonardo", "Isabela", "Matheus", "Natalia", "Daniel",
  "Aline", "Eduardo", "Bruna", "Henrique", "Carla", "Vinicius", "Renata",
];

const lastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves",
  "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho",
  "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha",
  "Dias", "Nascimento", "Andrade", "Moreira", "Nunes", "Marques", "Machado",
  "Mendes", "Freitas", "Cardoso", "Ramos", "Gonçalves", "Santana", "Teixeira",
];

const emailProviders = ["gmail.com", "gmail.com", "gmail.com", "hotmail.com", "outlook.com"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomName(): string {
  return `${randomItem(firstNames)} ${randomItem(lastNames)}`;
}

function generateRandomEmail(name: string): string {
  const clean = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".");
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${clean}${num}@${randomItem(emailProviders)}`;
}

function generateValidCPF(): string {
  const digits: number[] = [];
  for (let i = 0; i < 9; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // First check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  digits.push(rest);

  // Second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  digits.push(rest);

  return digits.join("");
}

function generateValidPhone(): string {
  const ddd = [11, 21, 31, 41, 51, 61, 71, 81, 85, 27, 48, 47, 19, 15, 13, 12][
    Math.floor(Math.random() * 16)
  ];
  const num = Math.floor(Math.random() * 90000000) + 10000000;
  return `${ddd}9${num}`;
}

// ---- Main handler ----

serve(async (req) => {
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

    const { planId, planName, amount, tracking }: CreatePixRequest = await req.json();

    if (!planId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate random valid customer data
    const name = generateRandomName();
    const email = generateRandomEmail(name);
    const document = generateValidCPF();
    const phone = generateValidPhone();

    console.log('Creating PIX transaction with random customer:', {
      planId, planName, amount,
      customer: { name, email, document: document.slice(0, 3) + '***', phone: phone.slice(0, 4) + '***' },
    });

    const reference = `ANITTA-${planId}-${Date.now()}`;

    const requestBody: Record<string, unknown> = {
      amount: amount,
      description: `Assinatura Anitta Privacy - ${planName}`,
      reference: reference,
      productHash: productHash,
      customer: {
        name,
        email,
        document,
        phone,
      },
    };

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
