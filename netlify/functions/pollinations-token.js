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

    var body = JSON.parse(event.body || "{}");

    var code = body.code;
    var codeVerifier = body.code_verifier;
    var redirectUri = body.redirect_uri;

    if (!code || !codeVerifier || !redirectUri) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Missing OAuth parameters"
        })
      };
    }

    var clientId = process.env.POLLINATIONS_CLIENT_ID;

    if (!clientId) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "POLLINATIONS_CLIENT_ID is not configured"
        })
      };
    }

    var params = new URLSearchParams();

    params.append(
      "grant_type",
      "authorization_code"
    );

    params.append(
      "code",
      code
    );

    params.append(
      "client_id",
      clientId
    );

    params.append(
      "redirect_uri",
      redirectUri
    );

    params.append(
      "code_verifier",
      codeVerifier
    );

    var response = await fetch(
      "https://enter.pollinations.ai/api/oauth/token",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },

        body: params.toString()
      }
    );

    var data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          error:
            data.error_description ||
            data.error ||
            "OAuth token exchange failed"
        })
      };
    }

    return {
      statusCode: 200,

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        access_token:
          data.access_token,

        token_type:
          data.token_type,

        expires_in:
          data.expires_in,

        scope:
          data.scope
      })
    };

  } catch (error) {

    return {
      statusCode: 500,

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        error:
          error.message ||
          "Unknown error"
      })
    };
  }
};
