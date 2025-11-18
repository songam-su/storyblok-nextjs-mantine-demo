const fs = require('fs');
const devcert = require('devcert');

const destination = './.dev/cert';
const certPath = `${destination}/certificate.crt`;
const keyPath = `${destination}/privateKey.key`;

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  devcert
    .certificateFor('localhost')
    .then(({ key, cert }) => {
      fs.writeFileSync(keyPath, key);
      fs.writeFileSync(certPath, key);
    })
    .catch(console.error);
}
