
require('ts-node').register({ transpileOnly: true });
const sitemap = require('./src/app/sitemap.ts').default;
sitemap().then(res => console.log(JSON.stringify(res, null, 2))).catch(err => console.error(err));
