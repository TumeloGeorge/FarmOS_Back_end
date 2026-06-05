require('dotenv').config();
const seedRBAC = require('../src/db/seeders/rbac.seeder');

(async () => {
    try {
        await seedRBAC();
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();