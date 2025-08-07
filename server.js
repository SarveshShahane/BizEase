const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const FormData = require("form-data");

const app = express();
const PORT = 3000;
const qs = require("qs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post("/post", upload.single("media"), async (req, res) => {
  const { caption, platforms } = req.body;
  const selectedPlatforms = Array.isArray(platforms) ? platforms : [platforms];
  const filePath = req.file?.path;

  console.log("Form submission received:");
  console.log("Caption:", caption);
  console.log("Platforms:", selectedPlatforms);
  console.log("File path:", filePath || "No file uploaded");

  const responses = [];

  if (selectedPlatforms.includes("telegram")) {
    const tgRes = await sendToTelegram(filePath, caption);
    responses.push("Telegram: " + tgRes);
  }

  if (selectedPlatforms.includes("reddit")) {
    const redditRes = await postToReddit(caption, filePath);
    responses.push("Reddit: " + redditRes);
  }

  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log("Uploaded file cleaned up:", filePath);
    } catch (err) {
      console.error("Error cleaning up file:", err.message);
    }
  }

  res.send("Posted to:\n" + responses.join("\n"));
});

async function postToReddit(caption, filePath) {
  try {
    console.log("Attempting Reddit post with caption:", caption);
    console.log("Reddit posts are text-only (images not supported in this implementation)");
  
    const tokenRes = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      qs.stringify({
        grant_type: "password",
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD
      }),
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_CLIENT_SECRET
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "ease-of-business-script/1.0 by " + process.env.REDDIT_USERNAME
        }
      }
    );

    console.log("Token request successful");
    const accessToken = tokenRes.data.access_token;
    
    if (!accessToken) {
      console.error("No access token received from Reddit");
      return "Failed - No access token";
    }

    const postData = {
      sr: process.env.REDDIT_SUBREDDIT,
      kind: "self",
      title: caption,
      text: "Posted via Ease of Business 🚀",
      api_type: "json" 
    };

    console.log("Submitting post to subreddit:", process.env.REDDIT_SUBREDDIT);

    const postRes = await axios.post(
      "https://oauth.reddit.com/api/submit",
      qs.stringify(postData),
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
          "User-Agent": "ease-of-business-script/1.0 by " + process.env.REDDIT_USERNAME,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    console.log("Reddit API Response:", postRes.data);

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

async function sendToTelegram(filePath, caption) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      console.log("Sending photo to Telegram with caption");
      const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`;
      
      const form = new FormData();
      form.append("chat_id", process.env.TELEGRAM_CHAT_ID);
      form.append("caption", caption);
      form.append("photo", fs.createReadStream(filePath));

      const response = await axios.post(url, form, {
        headers: form.getHeaders()
      });
      
      console.log("Telegram photo sent successfully");
      return "Success - Photo sent";
    } else {
      console.log("Sending text-only message to Telegram");
      const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      const response = await axios.post(url, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: caption,
        parse_mode: "HTML"
      });
      
      console.log("Telegram text message sent successfully");
      return "Success - Text sent";
    }
  } catch (err) {
    console.error("Telegram error:", err.response?.data || err.message);
    return "Failed - " + (err.response?.data?.description || err.message);
  }
}

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
