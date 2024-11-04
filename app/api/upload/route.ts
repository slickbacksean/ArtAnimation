import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { detect_objects } from '../../lib/yolo_inference';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'uploads');
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error processing the image:', err);
      return res.status(500).json({ error: 'Error processing the image' });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = file.path;
    try {
      const results = await detect_objects(filePath);
      if (!results) {
        return res.status(500).json({ error: 'Object detection failed' });
      }

      res.status(200).json({ results, file_path: filePath });
    } catch (error) {
      console.error('Error processing the image:', error);
      res.status(500).json({ error: 'Error processing the image' });
    }
  });
}