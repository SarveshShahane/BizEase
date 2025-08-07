const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

async function testRedditAPI() {
  console.log("Testing Reddit API...");
  console.log("Environment variables:");
  console.log("REDDIT_CLIENT_ID:", process.env.REDDIT_CLIENT_ID ? "Set" : "Missing");
  console.log("REDDIT_CLIENT_SECRET:", process.env.REDDIT_CLIENT_SECRET ? "Set" : "Missing");
  console.log("REDDIT_USERNAME:", process.env.REDDIT_USERNAME ? "Set" : "Missing");
  console.log("REDDIT_PASSWORD:", process.env.REDDIT_PASSWORD ? "Set" : "Missing");
  console.log("REDDIT_SUBREDDIT:", process.env.REDDIT_SUBREDDIT ? "Set" : "Missing");
  console.log("\n");

  try {
    console.log("Step 1: Getting access token...");
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
          "User-Agent": "ease-of-business-test/0.1 by " + process.env.REDDIT_USERNAME
        }
      }
    );

    console.log("Token response status:", tokenRes.status);
    console.log("Token response data:", JSON.stringify(tokenRes.data, null, 2));
    
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      console.error("No access token received!");
      return;
    }

    console.log("\nStep 2: Testing post submission...");
    const postData = {
      sr: process.env.REDDIT_SUBREDDIT,
      kind: "self",
      title: "Test Post from Ease of Business",
      text: "This is a test post to verify API functionality 🚀",
      api_type: "json"
    };

    const postRes = await axios.post(
      "https://oauth.reddit.com/api/submit",
      qs.stringify(postData),
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
          "User-Agent": "ease-of-business-test/0.1 by " + process.env.REDDIT_USERNAME,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    console.log("Post response status:", postRes.status);
    console.log("Post response data:", JSON.stringify(postRes.data, null, 2));

    if (postRes.data.json && postRes.data.json.errors && postRes.data.json.errors.length > 0) {
      console.error("Reddit API Errors:", postRes.data.json.errors);
    } else {
      console.log("✅ Post successful!");
    }

  } catch (err) {
    console.error("❌ Error occurred:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Headers:", err.response.headers);
      console.error("Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Error message:", err.message);
    }
  }
}

testRedditAPI();
