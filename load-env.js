require('dotenv').config();
console.log('Environment loaded - OpenAI Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
