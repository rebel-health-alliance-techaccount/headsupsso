# Heads Up Dashboard Integration (Webflow & Netlify)

## Overview
This project integrates the **Heads Up Dashboard** into a Webflow site using Netlify serverless functions. The implementation consists of:

- **Webflow Frontend**: Embeds an iframe that loads the dashboard.
- **Netlify Functions**:
  - `generateJWT`: Fetches a JWT token from the authentication server.
  - `getSSO`: Retrieves a secure user link based on the JWT and user ID.

## Webflow Basic Implementation
To integrate the Heads Up Dashboard into Webflow, follow these steps:

### 1. Add the Following Custom Code to Webflow
Insert the following **before the closing `</body>` tag** in Webflow’s **Custom Code** section:

```html
<style>
iframe#heads_up_dashboard {
    width: 100%;
    height: 100vh;
    border: none;
    display: none;
}
</style>
<iframe id="heads_up_dashboard" title="Heads Up Dashboard"></iframe>
<script>
    async function fetchJWT() {
        try {
            const response = await fetch('https://your-netlify-site.netlify.app/.netlify/functions/generateJWT');
            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error("Error fetching JWT:", error);
            return null;
        }
    }

    async function fetchSSO(accessToken, userId) {
        try {
            const response = await fetch(`https://your-netlify-site.netlify.app/.netlify/functions/getSSO?token=${accessToken}&id=${userId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await response.json();
            return data.secure_user_link_data;
        } catch (error) {
            console.error("Error fetching SSO:", error);
            return null;
        }
    }

    window.$memberstackDom.getCurrentMember().then(async ({ data: member }) => {
        if (member) {
            const userId = member.customFields["headsup-sso"];
            const orgUuid = "Headsup_ORG_ID"; //Replace with Organisation ID.
            const jwtToken = await fetchJWT();

            if (jwtToken) {
                const secureUserLink = await fetchSSO(jwtToken, userId);

                if (secureUserLink) {
                    document.getElementById('heads_up_dashboard').src = `https://dashboard.rebelhealthalliance.io/dashboard?org_uuid=${orgUuid}&sec_p=${secureUserLink}`;
                    document.getElementById('heads_up_dashboard').style.display = 'block';
                }
            }
        }
    });
</script>
```

## Netlify App Installation Guide (Git Repository) - FOR LOCAL ENVIRONMENT SAME PROCESS FOR PRODUCTION
### 1. Clone the Repository
```sh
git clone https://github.com/rebel-health-alliance-techaccount/headsupsso.git
cd headsupsso
```

### 2. Install Dependencies
Ensure you have **Node.js** installed, then run:
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of your project and add:
```sh
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

### 4. Deploy to Netlify
Login to Netlify CLI and deploy the project:
```sh
netlify login
netlify init
netlify deploy --prod
```

### 5. Verify Deployment
Once deployed, use your **Netlify site URL** to update the Webflow `fetch` URLs accordingly.

## Conclusion
This guide provides a streamlined setup for integrating the Heads Up Dashboard with Webflow and deploying Netlify functions from a Git repository.

