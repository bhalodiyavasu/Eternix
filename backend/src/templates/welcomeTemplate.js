const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const buildWelcomeHtml = (username) => {
  const cleanUsername = (username || "THERE").toUpperCase();
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>WELCOME TO ETERNIX</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%;">

  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
    
    <div style="padding-bottom: 24px; text-align: left;">
      <div style="font-size: 24px; font-weight: 800; color: #111111; text-transform: uppercase; letter-spacing: 0px;">
        ETERNIX
      </div>
      <div style="font-size: 10px; font-weight: 500; color: #777777; text-transform: uppercase; letter-spacing: 1px;">
        DESIGNED TO TRANSCEND SEASONS
      </div>
    </div>

    <div style="padding: 16px 0 0 0; text-align: left;">
      <p style="font-size: 12px; font-weight: 700; color: #555555; margin: 0 0 16px 0; letter-spacing: 0.5px; text-transform: uppercase;">
        HELLO ${cleanUsername},
      </p>
      
      <h1 style="font-size: 24px; font-weight: 800; color: #111111; margin: 0 0 20px 0; letter-spacing: -0.5px; text-transform: uppercase; line-height: 1.2;">
        YOUR ETERNIX ACCOUNT IS READY.
      </h1>

      <p style="font-size: 13px; color: #222222; margin: 0 0 16px 0; line-height: 1.6; letter-spacing: 0.3px;">
        THANK YOU FOR JOINING ETERNIX. YOUR ACCOUNT HAS BEEN CREATED SUCCESSFULLY AND IS NOW ACTIVE. WE ARE GLAD TO HAVE YOU HERE.
      </p>

      <p style="font-size: 13px; color: #222222; margin: 0 0 32px 0; line-height: 1.6; letter-spacing: 0.3px;">
        YOU CAN NOW SIGN IN AND START BROWSING. ALL YOUR ORDERS AND ACCOUNT DETAILS WILL BE AVAILABLE IN ONE PLACE. IF YOU DID NOT CREATE THIS ACCOUNT, YOU CAN SAFELY IGNORE THIS EMAIL.
      </p>
      
      <div style="margin: 0 0 32px 0;">
        <a href="${FRONTEND_URL}"
           target="_blank"
           style="background-color: #000000; color: #ffffff; padding: 16px 32px; font-size: 11px; font-weight: 700; text-decoration: none; display: inline-block; letter-spacing: 2px; text-transform: uppercase; border: 1px solid #000000; text-align: center;">
          EXPLORE THE COLLECTION
        </a>
      </div>
    </div>

    <div style="text-align: left;">
      <p style="font-size: 12px; color: #666666; margin: 0 0 16px 0; line-height: 1.5; letter-spacing: 0.3px;">
        IF YOU HAVE QUESTIONS OR REQUIRE ASSISTANCE, OUR GLOBAL CARE TEAM IS PREPARED TO RESPOND.
      </p>
      <p style="font-size: 13px; font-weight: 600; color: #111111; margin: 0 0 2px 0; letter-spacing: 0.5px;">
        BEST REGARDS,
      </p>
      <p style="font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #111111; margin: 0;">
        THE ETERNIX TEAM
      </p>
    </div>

    <div style="background-color: #000000; color: #ffffff; padding: 36px 24px; text-align: center; margin-top: 30px;">
      <div style="font-size: 18px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 2px;">
        ETERNIX
      </div>
      
      <div style="font-size: 11px; color: #aaaaaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
        DEVELOPED BY <a href="https://github.com/bhalodiyavasu" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: 700; letter-spacing: 1px;">VASU BHALODIYA</a>
      </div>

      <div style="font-size: 10px; color: #888888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;">
        THIS IS AN ACCOUNT CONFIRMATION EMAIL FROM <a href="http://eternix.vasubhalodiya.in/" target="_blank" style="color: #ffffff; text-decoration: underline;">ETERNIX</a>
      </div>
      
      <div style="font-size: 9px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
        © 2026 ETERNIX. ALL RIGHTS RESERVED.
      </div>
    </div>

  </div>

</body>
</html>
`;
};

module.exports = {
  buildWelcomeHtml
};
