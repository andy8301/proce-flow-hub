import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPREADSHEET_ID = '1-TUAuFrz9af4NYID7p9-eAkdZAubFG8NzJHcOvT1up0';
const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');

// Actual sheet names from the spreadsheet
const SHEET_NAMES = {
  BASE_OLGA: 'Base Olga',
  CORREOS: 'BASE CORREOS ELECTRONICOS',
  NEXURA: 'Base NEXURA',
  FISCALIZACION: 'Base Traslados Fiscalización',
  TUTELAS: 'BASE TUTELAS',
  CONSOLIDADO: 'CONSOLIDADO BASES',
  RESOLUCIONES: 'RES',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, sheetName, data, range } = await req.json();
    
    console.log(`Processing action: ${action} for sheet: ${sheetName || 'all'}`);

    if (action === 'read') {
      // Read data from a specific sheet or all sheets
      const sheets = sheetName ? [sheetName] : Object.values(SHEET_GIDS);
      const results: Record<string, any[]> = {};

      for (const sheet of sheets) {
        const sheetRange = range || `'${sheet}'!A:Z`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetRange)}?key=${GOOGLE_API_KEY}`;
        
        console.log(`Fetching data from sheet: ${sheet}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error fetching sheet ${sheet}:`, errorText);
          results[sheet] = [];
          continue;
        }

        const sheetData = await response.json();
        
        if (sheetData.values && sheetData.values.length > 0) {
          // Convert to array of objects using first row as headers
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
      // Append a new row to a sheet
      if (!sheetName || !data) {
        return new Response(JSON.stringify({ success: false, error: 'Missing sheetName or data' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const appendRange = range || `'${sheetName}'!A:Z`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${GOOGLE_API_KEY}`;

      console.log(`Appending data to sheet: ${sheetName}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [data],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error appending data:', errorText);
        return new Response(JSON.stringify({ success: false, error: errorText }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result = await response.json();
      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'update') {
      // Update a specific row in a sheet
      if (!sheetName || !data || !range) {
        return new Response(JSON.stringify({ success: false, error: 'Missing sheetName, data, or range' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED&key=${GOOGLE_API_KEY}`;

      console.log(`Updating data in sheet: ${sheetName} at range: ${range}`);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [data],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error updating data:', errorText);
        return new Response(JSON.stringify({ success: false, error: errorText }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result = await response.json();
      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'getSheetNames') {
      // Get all sheet names from the spreadsheet
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_API_KEY}`;
      
      console.log('Fetching spreadsheet metadata');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching metadata:', errorText);
        return new Response(JSON.stringify({ success: false, error: errorText }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in google-sheets function:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
