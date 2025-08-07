# 📱 Ease of Business - Social Media Poster

A modern, streamlined social media posting application that allows you to share content across multiple platforms simultaneously. Built with Node.js and Express, featuring a beautiful modern UI.

![Ease of Business Banner](https://img.shields.io/badge/Social_Media-Multi_Platform_Poster-blue?style=for-the-badge)

## ✨ Features

- 🚀 **Multi-Platform Posting**: Post to Telegram and Reddit simultaneously
- 📝 **Text & Image Support**: Share text-only posts or posts with images
- 🎨 **Modern UI**: Beautiful gradient design with responsive layout
- 📱 **Mobile Friendly**: Works seamlessly on all devices
- ⚡ **Real-time Feedback**: Instant status updates for each platform
- 🔒 **Secure**: Environment variables for API credentials

## 🛠️ Supported Platforms

| Platform | Text Posts | Image Posts | Status |
|----------|------------|-------------|---------|
| 📱 **Telegram** | ✅ | ✅ | Active |
| 🤖 **Reddit** | ✅ | ❌* | Active |

*Reddit integration focuses on text posts. Images are ignored for Reddit submissions.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token
- Reddit API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SarveshShahane/ease-of-business.git
   cd ease-of-business
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Telegram Configuration
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_chat_id_or_channel

   # Reddit Configuration
   REDDIT_CLIENT_ID=your_reddit_client_id
   REDDIT_CLIENT_SECRET=your_reddit_client_secret
   REDDIT_USERNAME=your_reddit_username
   REDDIT_PASSWORD=your_reddit_password
   REDDIT_SUBREDDIT=your_target_subreddit
   ```

4. **Start the application**
   ```bash
   npm start
   # or
   node server.js
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## ⚙️ Configuration Guide

### 🤖 Telegram Setup

1. **Create a Telegram Bot**:
   - Message `@BotFather` on Telegram
   - Use `/newbot` command
   - Get your bot token

2. **Get Chat ID**:
   - For channels: Use `@yourchannel` format
   - For groups: Use the group chat ID
   - For personal: Use your user ID

### 📮 Reddit Setup

1. **Create Reddit App**:
   - Go to [Reddit Apps](https://www.reddit.com/prefs/apps)
   - Click "Create App"
   - Choose "script" type
   - Note your Client ID and Secret

2. **Configure Subreddit**:
   - Ensure you have posting permissions
   - Use subreddit name without r/ prefix

## 📁 Project Structure

```
ease-of-business/
├── public/
│   └── index.html          # Frontend UI
├── uploads/                # Temporary file storage
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
├── server.js              # Main application
└── README.md             # This file
```

## 🎨 UI Features

- **Gradient Background**: Modern purple-blue gradient design
- **Glass Morphism**: Frosted glass effects with backdrop blur
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Hover animations and smooth transitions
- **Platform Badges**: Visual indicators for supported platforms
- **Navigation Bar**: Clean, sticky navigation

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Main application page |
| `POST` | `/post` | Submit content to platforms |

## 📝 Usage Examples

### Text-Only Post
1. Enter your caption
2. Select target platforms (Telegram/Reddit)
3. Click "Post to Selected Platforms"

### Image Post
1. Enter your caption
2. Upload an image file
3. Select platforms
4. Submit the post

## 🛡️ Security

- **Environment Variables**: All sensitive data stored in `.env`
- **File Cleanup**: Uploaded files automatically removed after processing
- **Input Validation**: Form data validated before processing
- **Error Handling**: Comprehensive error handling for all API calls

## 🚨 Troubleshooting

### Common Issues

**"No platforms selected"**
- Ensure at least one platform checkbox is selected

**"Telegram Failed"**
- Check bot token and chat ID
- Verify bot has permission to post in the target chat/channel

**"Reddit Failed"**
- Verify Reddit credentials
- Check if you have posting permissions in the target subreddit
- Ensure subreddit name is correct (without r/ prefix)

**"File upload errors"**
- Check file size (keep under 10MB)
- Ensure file is a valid image format
- Verify uploads/ directory exists and is writable

## 📊 Development

### Available Scripts

```bash
# Start the server
npm start
node server.js

# Development with auto-restart (if nodemon is installed)
npm run dev
nodemon server.js
```

### Dependencies

```json
{
  "express": "^5.1.0",
  "multer": "^1.4.5",
  "axios": "^1.7.7",
  "form-data": "^4.0.1",
  "qs": "^6.13.0",
  "dotenv": "^17.2.1"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Telegram Bot API** for seamless messaging integration
- **Reddit API** for content submission capabilities
- **Express.js** for the robust web framework
- **Multer** for file upload handling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Contact the development team

---

**Made with ❤️ for easy social media management**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
