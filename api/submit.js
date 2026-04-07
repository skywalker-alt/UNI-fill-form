export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SHEET_BEST_URL = process.env.SHEET_BEST_URL;

  if (!SHEET_BEST_URL) {
    return res.status(500).json({ error: 'SHEET_BEST_URL environment variable is not set' });
  }

  try {
    const response = await fetch(SHEET_BEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Sheet.best responded with status: ${response.status}`);
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
