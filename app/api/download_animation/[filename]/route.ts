import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.query;
  const filePath = path.join(process.cwd(), 'uploads', filename as string);

  try {
    const fileStream = fs.createReadStream(filePath);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading animation:', error);
    res.status(500).json({ error: 'Error downloading animation' });
  }
}