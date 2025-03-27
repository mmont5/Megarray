import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from './db/connect';
import Content from './models/Content';
import { generateContent, humanizeContent } from './services/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { type, topic, industry, keywords, humanize } = req.body;

    // Generate content using OpenAI
    let content = await generateContent(type, topic, industry, keywords);

    // Humanize if requested
    if (humanize) {
      content = await humanizeContent(content);
    }

    // Save to MongoDB
    const newContent = await Content.create({
      userId: req.body.userId,
      type,
      topic,
      industry,
      keywords,
      content,
      isHumanized: humanize,
    });

    res.status(200).json({ content: newContent.content });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
}