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

    const { prompt } = JSON.parse(event.body || "{}");

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Prompt is required"
        })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "GEMINI_API_KEY is not configured"
        })
      };
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],

          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error || "Image generation failed"
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };

  }
};
