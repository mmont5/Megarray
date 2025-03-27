import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateContent = async (
  type: string,
  topic: string,
  industry: string,
  keywords: string[]
) => {
  const prompt = `Create a ${type} about ${topic} in the ${industry} industry.
Include these keywords: ${keywords.join(', ')}.
Make it engaging and natural-sounding.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert marketing content creator with deep knowledge of digital marketing and content strategy."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });

  return completion.choices[0].message.content;
};

export const humanizeContent = async (content: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert at making AI-generated content sound more human and natural."
      },
      {
        role: "user",
        content: `Make this content sound more natural and human-like, while maintaining its professional tone: ${content}`
      }
    ],
    temperature: 0.8,
    max_tokens: 1000
  });

  return completion.choices[0].message.content;
};