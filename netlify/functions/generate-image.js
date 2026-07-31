exports.handler = async function (event) {

  if (event.httpMethod !== "POST") {

    return {
      statusCode:405,

      headers:{
        "Content-Type":
          "application/json"
      },

      body:JSON.stringify({
        error:"Method Not Allowed"
      })
    };

  }


  try {

    const body =
      JSON.parse(
        event.body || "{}"
      );


    const prompt =
      body.prompt;

    const accessToken =
      body.access_token;


    if(!prompt){

      return {
        statusCode:400,

        headers:{
          "Content-Type":
            "application/json"
        },

        body:JSON.stringify({
          error:
            "Prompt وارد نشده است."
        })
      };

    }


    if(!accessToken){

      return {
        statusCode:401,

        headers:{
          "Content-Type":
            "application/json"
        },

        body:JSON.stringify({
          error:
            "Pollinations متصل نیست."
        })
      };

    }


    const imageUrl =
      "https://gen.pollinations.ai/image/" +
      encodeURIComponent(prompt) +
      "?model=flux";


    const response =
      await fetch(
        imageUrl,
        {

          method:"GET",

          headers:{
            "Authorization":
              "Bearer " + accessToken
          }

        }
      );


    if(!response.ok){

      const errorText =
        await response.text();

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
              errorText ||
              "Pollinations image generation failed."
          })
      };

    }


    const contentType =
      response.headers.get(
        "content-type"
      ) || "image/jpeg";


    const arrayBuffer =
      await response.arrayBuffer();


    const base64 =
      Buffer
        .from(arrayBuffer)
        .toString("base64");


    const image =
      "data:" +
      contentType +
      ";base64," +
      base64;


    return {

      statusCode:200,

      headers:{
        "Content-Type":
          "application/json"
      },

      body:
        JSON.stringify({
          image:image
        })

    };


  }catch(error){

    console.error(
      "Generate image error:",
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
            "خطا در ساخت تصویر: " +
            error.message

        })

    };

  }

};
