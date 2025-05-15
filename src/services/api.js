// Create a separate backend server (Node.js/Express) to handle API requests securely
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { apiKey, baseUrl, model, messages } = req.body;
    
    const openai = new OpenAI({
      apiKey,
      baseURL: baseUrl
    });

    const completion = await openai.chat.completions.create({
      model,
      messages
    });

    res.json({ response: completion.choices[0].message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));