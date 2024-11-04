import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { cache_manager } from '../../lib/cache_manager';
import { queue_manager } from '../../lib/queue_manager';
import { animation_engine } from '../../lib/animation_engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image_path, animation_type, objects } = req.body;

  if (!image_path || !animation_type || !objects) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const cache_key = `${image_path}:${animation_type}:${hash(JSON.stringify(objects))}`;
    const cached_result = await cache_manager.get_cached_animation(cache_key);
    if (cached_result) {
      return res.status(200).json(cached_result);
    }

    const job_id = uuidv4();
    await queue_manager.enqueue_animation(
      animation_engine.apply_animation,
      job_id,
      image_path,
      animation_type,
      objects
    );

    res.status(202).json({ job_id, message: 'Animation job queued' });
  } catch (error) {
    console.error('Error queueing animation job:', error);
    res.status(500).json({ error: 'Error queueing animation job' });
  }
}