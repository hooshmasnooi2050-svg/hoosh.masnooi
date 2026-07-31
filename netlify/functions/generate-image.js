exports.handler = async function (event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          error: "Method not allowed"
        })
      };
    }

    var body = JSON.parse(event.body || "{}");
    var prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Prompt is required"
        })
      };
    }

    // کلید فقط از Netlify Environment Variable خوانده می‌شود
    var apiKey = process.env.POLLINATIONS_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            "POLLINATIONS_API_KEY is not configured"
        })
      };
    }

    var encodedPrompt =
      encodeURIComponent(prompt);

    var imageUrl =
      "https://gen.pollinations.ai/image/" +
      encodedPrompt +
      "?model=flux&width=1024&height=1024";

    var response = await fetch(imageUrl, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + apiKey
      }
    });

    if (!response.ok) {
      var errorText = await response.text();

      return {
        statusCode: response.status,
        body: JSON.stringify({
          error:
            errorText ||
            "Image generation failed"
        })
      };
    }

    var imageBuffer =
      await response.arrayBuffer();

    var base64Image =
      Buffer
        .from(imageBuffer)
        .toString("base64");

    return {
      statusCode: 200,

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        image:
          "data:image/png;base64," +
          base64Image
      })
    };

  } catch (error) {

    return {
      statusCode: 500,

      body: JSON.stringify({
        error:
          error.message ||
          "Unknown error"
      })
    };
  }
};
