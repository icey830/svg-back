'use strict';
/* eslint-disable import/order */

const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Set up Sentry reporting as early in the process as possible.
const config = require('config').util.toObject();


if (+process.argv[2]) {
  config.public.bind.port = +process.argv[2]
}
if (process.argv[3]) {
  config.public.bind.address = process.argv[3]
}

console.log('Configuration:');
console.dir(config.public, { depth: null });

const legacySecretsPath = path.join(__dirname, 'private', 'secret.json');
if (fs.existsSync(legacySecretsPath)) {
  console.error(
    `Legacy secrets file found at ${legacySecretsPath}. It should be deleted and secrets replaced with environment variables or config/local.yml`
  );
  process.exit(1)
}

const Server = require('./core/server/server');
const server = (module.exports = new Server(config))

;(async () => {
  try {
    await server.start()
  } catch (e) {
    console.error(e);
    process.exit(1)
  }
})();
