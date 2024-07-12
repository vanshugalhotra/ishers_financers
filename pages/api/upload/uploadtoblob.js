import { put } from '@vercel/blob';

// Default export for Pages API Routes
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { query } = req;
  const filename = query.filename;

  // Upload the file to Vercel Blob Storage
  const blob = await put(filename, req, {
    access: 'public',
  });

  res.status(200).json(blob);
}

// Export config to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};
