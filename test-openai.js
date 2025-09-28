require('dotenv').config();
const OpenAI = require('openai');

async function testOpenAI() {
  try {
    const key = process.env.OPENAI_API_KEY;
    console.log('Testing OpenAI with key length:', key ? key.length : 'missing');
    
    const openai = new OpenAI({ apiKey: key });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10
    });
    
    console.log('✅ OpenAI works!');
    console.log('Response:', completion.choices[0].message.content);
    
  } catch (error) {
    console.log('❌ OpenAI Error:', error.message);
    if (error.code) console.log('Error code:', error.code);
  }
}

testOpenAI();
