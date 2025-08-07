const app = require('./api/index.js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Telegram Bot: ${process.env.TELEGRAM_BOT_TOKEN ? 'Configured ✅' : 'Missing ❌'}`);
  console.log(`🔧 Reddit API: ${process.env.REDDIT_CLIENT_ID ? 'Configured ✅' : 'Missing ❌'}`);
});
