import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
  try {
    const { message, context, currentField, isSupervisor } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: isSupervisor 
            ? "You are an experienced event planning supervisor helping with specific details."
            : "You are an event planning assistant collecting essential information."
        },
        {
          role: "user",
          content: `Context: ${JSON.stringify(context)}\nCurrent field: ${currentField}\nUser message: ${message}`
        }
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

export default router; 