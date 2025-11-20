const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function generateCert(domains = ['localhost', '127.0.0.1', '::1']) {
  const certDir = path.resolve(process.cwd(), '.dev/certs');

  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  try {
    console.log(`Generating cert for domains: ${domains.join(', ')}`);

    // Run mkcert in Git Bash
    execSync(`bash -lc "mkcert ${domains.join(' ')}"`, {
      stdio: 'inherit',
      cwd: certDir,
      shell: true
    });

    // Find generated files
    const files = fs.readdirSync(certDir);
    const certFile = files.find(f => f.endsWith('.pem') && !f.includes('-key'));
    const keyFile = files.find(f => f.endsWith('-key.pem'));

    if (!certFile || !keyFile) {
      console.error('❌ mkcert did not produce expected files.');
      process.exit(1);
    }

    // Rename to desired names
    const newCertPath = path.join(certDir, 'localhost-crt.pem');
    const newKeyPath = path.join(certDir, 'localhost-key.pem');

    fs.renameSync(path.join(certDir, certFile), newCertPath);
    fs.renameSync(path.join(certDir, keyFile), newKeyPath);

    console.log(`✅ Certificates saved:
    - ${newCertPath}
    - ${newKeyPath}`);
  } catch (error) {
    console.error('❌ Error generating certificate:', error.message);
    process.exit(1);
  }
}

generateCert();