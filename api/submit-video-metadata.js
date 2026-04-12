import { supabase } from '../lib/supabase.js';

export default async function handler(request, response) {
  // Allow strict CORS if requested from other domains
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, phoneNumber, videoUrl } = request.body;

  if (!fullName || !phoneNumber || !videoUrl) {
    return response.status(400).json({ error: 'Missing required fields: fullName, phoneNumber, or videoUrl' });
  }

  try {
    const { data, error } = await supabase
      .from('video_submissions')
      .insert([
        { 
          full_name: fullName, 
          phone_number: phoneNumber, 
          video_url: videoUrl 
        }
      ]);

    if (error) {
      throw error;
    }

    return response.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Supabase insertion error:', error);
    return response.status(500).json({ error: 'Failed to save metadata to database' });
  }
}
