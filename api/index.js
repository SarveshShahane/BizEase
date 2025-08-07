const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const qs = require("qs");

// Initialize Express app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Configure multer for memory storage (Vercel doesn't support file system)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Main route - serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Handle form submission
app.post("/post", upload.single("media"), async (req, res) => {
  try {
    const { caption, platforms } = req.body;
    const selectedPlatforms = Array.isArray(platforms) ? platforms : [platforms];
    const file = req.file; // This will be a buffer in memory

    console.log("Form submission received:");
    console.log("Caption:", caption);
    console.log("Platforms:", selectedPlatforms);
    console.log("File uploaded:", file ? `Yes (${file.size} bytes)` : "No");

    if (!caption || !caption.trim()) {
      return res.status(400).json({ error: "Caption is required" });
    }

    if (!selectedPlatforms || selectedPlatforms.length === 0) {
      return res.status(400).json({ error: "At least one platform must be selected" });
    }

    const responses = [];

    if (selectedPlatforms.includes("telegram")) {
      const tgRes = await sendToTelegram(file, caption);
      responses.push("Telegram: " + tgRes);
    }

    if (selectedPlatforms.includes("reddit")) {
      const redditRes = await postToReddit(caption);
      responses.push("Reddit: " + redditRes);
    }

    // Return JSON response for better handling
    res.json({
      success: true,
      message: "Posted successfully!",
      results: responses
    });

  } catch (error) {
    console.error("Error in post handler:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
});

// Telegram function - modified to work with buffer
async function sendToTelegram(fileBuffer, caption) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error("Telegram credentials not configured");
    }

    if (fileBuffer && fileBuffer.buffer) {
      // Send photo with caption
      console.log("Sending photo to Telegram with caption");
      const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      
      const form = new FormData();
      form.append("chat_id", chatId);
      form.append("caption", caption);
      form.append("photo", fileBuffer.buffer, {
        filename: fileBuffer.originalname || "image.jpg",
        contentType: fileBuffer.mimetype || "image/jpeg"
      });

      const response = await axios.post(url, form, {
        headers: {
          ...form.getHeaders(),
        },
        timeout: 30000
      });
      
      console.log("Telegram photo sent successfully");
      return "Success - Photo sent";
    } else {
      // Send text-only message
      console.log("Sending text-only message to Telegram");
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      const response = await axios.post(url, {
        chat_id: chatId,
        text: caption,
        parse_mode: "HTML"
      }, {
        timeout: 30000
      });
      
      console.log("Telegram text message sent successfully");
      return "Success - Text sent";
    }
  } catch (err) {
    console.error("Telegram error:", err.response?.data || err.message);
    return "Failed - " + (err.response?.data?.description || err.message);
  }
}

// Reddit function
async function postToReddit(caption) {
  try {
    console.log("Attempting Reddit post with caption:", caption);
    console.log("Reddit posts are text-only (images not supported in this implementation)");

    const clientId = process.env.REDDIT_CLIENT_ID;
    const clientSecret = process.env.REDDIT_CLIENT_SECRET;
    const username = process.env.REDDIT_USERNAME;
    const password = process.env.REDDIT_PASSWORD;
    const subreddit = process.env.REDDIT_SUBREDDIT;

    if (!clientId || !clientSecret || !username || !password || !subreddit) {
      throw new Error("Reddit credentials not configured");
    }
  
    // Step 1: Get access token
    const tokenRes = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      qs.stringify({
        grant_type: "password",
        username: username,
        password: password
      }),
      {
        auth: {
          username: clientId,
          password: clientSecret
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "ease-of-business-script/1.0 by " + username
        },
        timeout: 30000
      }
    );

    console.log("Token request successful");
    const accessToken = tokenRes.data.access_token;
    
    if (!accessToken) {
      console.error("No access token received from Reddit");
      return "Failed - No access token";
    }

    // Step 2: Submit a text post
    const postData = {
      sr: subreddit,
      kind: "self",
      title: caption,
      text: "Posted via Ease of Business 🚀",
      api_type: "json"
    };

    console.log("Submitting post to subreddit:", subreddit);

    const postRes = await axios.post(
      "https://oauth.reddit.com/api/submit",
      qs.stringify(postData),
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
          "User-Agent": "ease-of-business-script/1.0 by " + username,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        timeout: 30000
      }
    );

    console.log("Reddit API Response:", postRes.data);

    // Check for Reddit API errors in the response body
    if (postRes.data.json && postRes.data.json.errors && postRes.data.json.errors.length > 0) {
      console.error("Reddit API Error:", postRes.data.json.errors);
      return "Failed - API Error: " + JSON.stringify(postRes.data.json.errors);
    }

    if (postRes.data.json && postRes.data.json.data && postRes.data.json.data.url) {
      console.log("Post created successfully:", postRes.data.json.data.url);
      return "Success - Post created";
    }

    return "Success";
  } catch (err) {
    console.error("Reddit error details:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    return "Failed - " + (err.response?.data?.message || err.message);
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message
  });
});

// Export the Express app as a serverless function
module.exports = app;
