exports.handler = async function (event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Method not allowed"
        })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Please enter an image description."
        })
      };
    }

    const apiKey = process.env.POLLINATIONS_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "POLLINATIONS_API_KEY is not configured."
        })
      };
    }

    const encodedPrompt = encodeURIComponent(prompt);

    const imageUrl =
      https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=1024&height=1024;

    const response = await fetch(imageUrl, {
      method: "GET",
      headers: {
        "Authorization": Bearer ${apiKey}
      }
    });

    if (!response.ok) {
      const errorText = await response.text();

      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: errorText || "Image generation failed."
        })
      };
    }

    const imageBuffer = await response.arrayBuffer();

    const base64Image = Buffer.from(imageBuffer).toString("base64");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: data:image/png;base64,${base64Image}
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: error.message || "Unknown server error."
      })
    };
  }
};
