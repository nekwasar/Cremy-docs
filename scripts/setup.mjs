import { cpSync, existsSync } from 'node:fs';

const templates = {
  '.env.secrets': 'secrets-template/.env.secrets.example',
  '.env':         'secrets-template/.env.docker.example',
  '.env.local':   '.env.development',
};

for (const [target, source] of Object.entries(templates)) {
  if (existsSync(target)) {
    console.log(`  skip  ${target} — already exists`);
  } else {
    cpSync(source, target);
    console.log(`  copy  ${target} ← ${source}`);
  }
}

console.log('Environment files ready.');
