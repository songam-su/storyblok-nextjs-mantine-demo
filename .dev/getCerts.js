/* 
 * COMMENTING THIS OUT, as selfsigned allows us to use in conjuction with pnpm (package installation and script 
 * execution), but it creates a ssl cert that isn't trusted by browsers. This creates a poor user experience.
 * Instead, for now, we will manually create the certs using mkcert, which will be trusted by browsers.
 * Execute the folling in the folder ~/.dev/certs:
 *   - mkcert -install
 *   - mkcert localhost 127.0.0.1 ::1
 * Then rename the generated files to certificate.crt and privateKey.key
 */
// const selfsigned = require('selfsigned');
// const fs = require('fs');
// const path = require('path');

// const certDir = path.join(__dirname, 'certs');
// if (!fs.existsSync(certDir)) {
//   fs.mkdirSync(certDir, { recursive: true });
// }

// console.log('🔐 Generating self-signed SSL certificate for Next.js...');

// const attrs = [{ name: 'commonName', value: 'localhost' }];
// const options = {
//   keySize: 2048,
//   days: 365,
//   algorithm: 'sha256',
// };

// const pems = selfsigned.generate(attrs, options);

// fs.writeFileSync(path.join(certDir, 'privateKey.key'), pems.private);
// fs.writeFileSync(path.join(certDir, 'certificate.crt'), pems.cert);

// console.log('✅ SSL certificate generated successfully!');
// console.log(`Files saved in: ${certDir}`);
