require('dotenv').config();

// Copy this over to LICENSE_KEY for geoip-lite
process.env.LICENSE_KEY = process.env.MAXMIND_KEY;

// Run update
require('geoip-lite/scripts/updatedb.js');
