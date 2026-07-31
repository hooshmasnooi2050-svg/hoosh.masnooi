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
    const accessToken = body.access_token;

    if (!prompt) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Prompt is required"
        })
      };
    }

    if (!accessToken) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Pollinations account is not connected"
        })
      };
    }

    if (!accessToken.startsWith("sk_")) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Invalid Pollinations user key"
        })
      };
    }

    const encodedPrompt = encodeURIComponent(prompt);

    const imageUrl =
      "https://gen.pollinations.ai/image/" +
      encodedPrompt +
      "?model=flux&width=1024&height=1024";

    const response = await fetch(imageUrl, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + accessToken
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
          error:
            errorText ||
            "Image generation failed"
        })
      };
    }

    const imageBuffer =
      await response.arrayBuffer();

    const base64Image =
      Buffer
        .from(imageBuffer)
        .toString("base64");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        image:
          "data:image/png;base64," +
          base64Image
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error:
          error.message ||
          "Unknown error"
      })
    };

  }
};
