exports.handler = async function (event) {

  if (event.httpMethod !== "POST") {

    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Method Not Allowed"
      })
    };

  }


  try {

    const body =
      JSON.parse(
        event.body || "{}"
      );


    const code =
      body.code;

    const codeVerifier =
      body.code_verifier;

    const redirectUri =
      body.redirect_uri;

    const clientId =
      body.client_id;


    if (
      !code ||
      !codeVerifier ||
      !redirectUri ||
      !clientId
    ) {

      return {
        statusCode: 400,
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          error:
            "اطلاعات OAuth ناقص است."
        })
      };

    }


    const params =
      new URLSearchParams();


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


    const response =
      await fetch(
        "https://enter.pollinations.ai/api/oauth/token",
        {

          method:"POST",

          headers:{
            "Content-Type":
              "application/x-www-form-urlencoded"
          },

          body:
            params.toString()

        }
      );


    const data =
      await response.json();


    if(!response.ok){

      return {
        statusCode:
          response.status,

        headers:{
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            error:
              data.error_description ||
              data.error ||
              "Pollinations OAuth failed"
          })

      };

    }


    return {

      statusCode:200,

      headers:{
        "Content-Type":
          "application/json"
      },

      body:
        JSON.stringify({

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


  }catch(error){

    console.error(
      "Pollinations token error:",
      error
    );


    return {

      statusCode:500,

      headers:{
        "Content-Type":
          "application/json"
      },

      body:
        JSON.stringify({

          error:
            "خطای داخلی در اتصال Pollinations: " +
            error.message

        })

    };

  }

};
