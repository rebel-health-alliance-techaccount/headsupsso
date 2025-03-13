const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
  try {
    const { token, id } = event.queryStringParameters;

    if (!token || !id) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow requests from any origin
          "Access-Control-Allow-Methods": "GET, OPTIONS", // Allow GET and OPTIONS requests
          "Access-Control-Allow-Headers": "Authorization, Content-Type", // Allow necessary headers
        },
        body: JSON.stringify({ error: "Missing token or ID" }),
      };
    }

    const url = `https://app.headsuphealth.com/api/v1/organizations/a0f28c9b-78e1-4225-91c4-e6c450f3070e/secure_user_link_data/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
