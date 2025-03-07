const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const port = 3000;

app.use(express.json());

const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const name = payload['name'];
    return { success: true, userid: userid, name: name };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { success: false, error: 'Invalid token' };
  }
}

app.post('/verify', async (req, res) => {
  const token = req.body.token;
  const verification = await verify(token);
  res.json(verification);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
