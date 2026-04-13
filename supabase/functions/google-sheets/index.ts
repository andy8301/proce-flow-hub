import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64url } from "https://deno.land/std@0.168.0/encoding/base64url.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPREADSHEET_ID = '1-TUAuFrz9af4NYID7p9-eAkdZAubFG8NzJHcOvT1up0';

const SHEET_NAMES = {
  BASE_OLGA: 'Base Olga',
  CORREOS: 'BASE CORREOS ELECTRONICOS',
  NEXURA: 'Base NEXURA',
  FISCALIZACION: 'Base Traslados Fiscalización',
  TUTELAS: 'BASE TUTELAS',
  CONSOLIDADO: 'CONSOLIDADO BASES',
  RESOLUCIONES: 'RES',
};

async function getAccessToken(): Promise<string> {
  const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON secret is not configured');
  }

  const sa = JSON.parse(serviceAccountJson);
  const scope = 'https://www.googleapis.com/auth/spreadsheets';

  // Create JWT header
  const header = { alg: 'RS256', typ: 'JWT' };

  // Create JWT claim set
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: sa.client_email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encoder = new TextEncoder();
  const headerB64 = base64url(encoder.encode(JSON.stringify(header)));
  const claimB64 = base64url(encoder.encode(JSON.stringify(claimSet)));
  const unsignedToken = `${headerB64}.${claimB64}`;

  // Import the private key and sign
  const pemContents = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), (c: string) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(unsignedToken)
  );

  const signatureB64 = base64url(new Uint8Array(signature));
  const jwt = `${unsignedToken}.${signatureB64}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('Token exchange error:', errorText);
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, sheetName, data, range } = await req.json();
    console.log(`Processing action: ${action} for sheet: ${sheetName || 'all'}`);

    const accessToken = await getAccessToken();
    const authHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    if (action === 'read') {
      const sheets = sheetName ? [sheetName] : Object.values(SHEET_NAMES);
      const results: Record<string, any[]> = {};

      for (const sheet of sheets) {
        const sheetRange = range || `'${sheet}'!A:BZ`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetRange)}`;

        const response = await fetch(url, { headers: authHeaders });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error fetching sheet ${sheet}:`, errorText);
          results[sheet] = [];
          continue;
        }

        const sheetData = await response.json();

        if (sheetData.values && sheetData.values.length > 0) {
          const headers = sheetData.values[0];
          const rows = sheetData.values.slice(1).map((row: string[]) => {
            const obj: Record<string, string> = {};
            headers.forEach((header: string, index: number) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });
          results[sheet] = rows;
        } else {
          results[sheet] = [];
        }
      }

      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'append') {
      if (!sheetName || !data) {
        return new Response(JSON.stringify({ success: false, error: 'Missing sheetName or data' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const appendRange = range || `'${sheetName}'!A:Z`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

      const response = await fetch(url, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ values: [data] }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error appending data:', errorText);
        return new Response(JSON.stringify({ success: false, error: errorText }), {
          status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result = await response.json();
      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'update') {
      if (!sheetName || !data || !range) {
        return new Response(JSON.stringify({ success: false, error: 'Missing sheetName, data, or range' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ values: [data] }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error updating data:', errorText);
        return new Response(JSON.stringify({ success: false, error: errorText }), {
          status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result = await response.json();
      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'getSheetNames') {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

      const response = await fetch(url, { headers: authHeaders });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching metadata:', errorText);
        return new Response(JSON.stringify({ success: false, error: errorText }), {
          status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const metadata = await response.json();
      const sheets = metadata.sheets?.map((sheet: any) => ({
        title: sheet.properties.title,
        sheetId: sheet.properties.sheetId,
        index: sheet.properties.index,
      })) || [];

      return new Response(JSON.stringify({ success: true, data: sheets }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in google-sheets function:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
