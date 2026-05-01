// ========================================
// MongoDB Initialization Script
// ========================================
// Creates a dedicated application user with least-privilege access.
// Root user is created by MONGO_INITDB_ROOT_* env vars.
// Runs only on first initialization (empty data directory).

const dbName = 'cremy-docs';
const appUser = 'cremy-app';
const appPassword = 'devpassword';

db = db.getSiblingDB(dbName);

if (!db.getUser(appUser)) {
  db.createUser({
    user: appUser,
    pwd: appPassword,
    roles: [{ role: 'readWrite', db: dbName }],
  });
  print(`Created application user: ${appUser} on database: ${dbName}`);
} else {
  print(`Application user already exists: ${appUser}`);
}
