import { NextApiRequest, NextApiResponse } from 'next';
import { queue_manager } from '../../../lib/queue_manager';
import { cache_manager } from '../../../lib/cache_manager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { job_id } = req.query;

  const job = await queue_manager.get_job(job_id as string);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.is_finished) {
    const result = job.result;
    await cache_manager.cache_animation(job_id as string, result);
    return res.status(200).json(result);
  } else if (job.is_failed) {
    return res.status(500).json({ error: 'Job failed' });
  } else {
    return res.status(202).json({ status: 'pending' });
  }
}