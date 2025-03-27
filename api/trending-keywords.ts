import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from './db/connect';
import Content from './models/Content';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { topic, industry } = req.body;

    // Mock trending keywords data
    // In production, you might want to use a service like Google Trends API
    const keywords = [
      { keyword: `${topic.toLowerCase()}tips`, volume: 1200, trending: true },
      { keyword: `${industry.toLowerCase()}trends`, volume: 800, trending: true },
      { keyword: `${topic.toLowerCase()}guide`, volume: 600, trending: false },
      { keyword: `${industry.toLowerCase()}insights`, volume: 500, trending: true },
    ];

    res.status(200).json({ keywords });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    res.status(500).json({ error: 'Failed to fetch keywords' });
  }
}