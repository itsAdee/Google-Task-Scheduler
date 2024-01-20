// Imort the required modules
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// Set the required scopes
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// loadSavedCredentialsIfExist loads the saved credentials if they exist
async function loadSavedCredentialsIfExist() {
  try {

    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    // If the credentials are not found or are invalid return null to signal that new credentials need to be saved.
    return null;
  }
}

// saveCredentials saves the credentials to the file specified by TOKEN_PATH.
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

// isFirstRun indicates if this is the first time the script is being run.
let isFirstRun = true;

// authorize returns an OAuth2 client with the given scopes.
async function authorize() {
  let client;
  if (isFirstRun) {
    // open the browser to the authorize url to start the workflow
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    isFirstRun = false;
  } else {
    // get saved credentials
    client = await loadSavedCredentialsIfExist();
    if (!client) {
      throw new Error('Failed to load saved credentials');
    }
  }
  // return an authenticated client
  return client;
}

// Export the authorize function
module.exports = authorize;