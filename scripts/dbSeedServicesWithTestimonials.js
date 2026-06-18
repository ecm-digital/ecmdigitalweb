const fs = require('fs');
const path = require('path');

// 1. Load active Firebase CLI credentials
const cliConfigPath = '/Users/tomaszgt/.config/configstore/firebase-tools.json';
if (!fs.existsSync(cliConfigPath)) {
  console.error(`❌ Error: Active Firebase CLI config not found at ${cliConfigPath}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(cliConfigPath, 'utf8'));
const tokens = config.tokens || {};
const refreshToken = tokens.refresh_token;

if (!refreshToken) {
  console.error('❌ Error: Refresh token not found in firebase-tools.json');
  process.exit(1);
}

// Well-known Firebase CLI client credentials
const client_id = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
const client_secret = "j9iVZfS8kkCEFUPaAeJV0sAi";

console.log(`✅ Loaded active Firebase CLI refresh token.`);

// 2. Parse serviceTranslations.ts
const translationsPath = path.join(__dirname, '..', 'src', 'app', 'services', 'serviceTranslations.ts');
if (!fs.existsSync(translationsPath)) {
  console.error(`❌ Error: serviceTranslations.ts not found at ${translationsPath}`);
  process.exit(1);
}

const content = fs.readFileSync(translationsPath, 'utf8');
const lines = content.split('\n');
const translations = { pl: {}, en: {}, de: {}, es: {}, szl: {}, ar: {} };
let currentLang = null;

for (let line of lines) {
  const trimmed = line.trim();
  
  // Detect language block
  const langMatch = trimmed.match(/^(pl|en|de|es|szl|ar):\s*\{/);
  if (langMatch) {
    currentLang = langMatch[1];
    continue;
  }
  
  if (!currentLang) continue;
  
  const colonIndex = trimmed.indexOf(':');
  if (colonIndex === -1) continue;
  
  let keyPart = trimmed.substring(0, colonIndex).trim();
  let valPart = trimmed.substring(colonIndex + 1).trim();
  
  // Strip quotes from key
  if ((keyPart.startsWith("'") && keyPart.endsWith("'")) || (keyPart.startsWith('"') && keyPart.endsWith('"'))) {
    keyPart = keyPart.substring(1, keyPart.length - 1);
  }
  
  // Strip quotes and trailing comma from value
  if (valPart.endsWith(',')) {
    valPart = valPart.substring(0, valPart.length - 1).trim();
  }
  if ((valPart.startsWith("'") && valPart.endsWith("'")) || (valPart.startsWith('"') && valPart.endsWith('"'))) {
    valPart = valPart.substring(1, valPart.length - 1);
  }
  
  // Unescape quotes
  valPart = valPart.replace(/\\'/g, "'").replace(/\\"/g, '"');
  
  translations[currentLang][keyPart] = valPart;
}

console.log('✅ Parsed serviceTranslations.ts successfully.');

// Helper functions to convert JSON to/from Firestore REST API format
function convertValueToFirestore(val) {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (typeof val === 'number') {
    return { doubleValue: val };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map(convertValueToFirestore)
      }
    };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = convertValueToFirestore(v);
    }
    return {
      mapValue: {
        fields
      }
    };
  }
  return { stringValue: String(val) };
}

function convertFirestoreToValue(firestoreVal) {
  if (!firestoreVal) return null;
  if ('nullValue' in firestoreVal) return null;
  if ('stringValue' in firestoreVal) return firestoreVal.stringValue;
  if ('doubleValue' in firestoreVal) return Number(firestoreVal.doubleValue);
  if ('integerValue' in firestoreVal) return Number(firestoreVal.integerValue);
  if ('booleanValue' in firestoreVal) return firestoreVal.booleanValue;
  if ('arrayValue' in firestoreVal) {
    const values = firestoreVal.arrayValue.values || [];
    return values.map(convertFirestoreToValue);
  }
  if ('mapValue' in firestoreVal) {
    const fields = firestoreVal.mapValue.fields || {};
    const res = {};
    for (const [k, v] of Object.entries(fields)) {
      res[k] = convertFirestoreToValue(v);
    }
    return res;
  }
  return null;
}

// 3. Connect to Firestore using direct REST API fetch calls
async function runSeeding() {
  console.log(`\n🔑 Exchanging active refresh token for Google OAuth2 Access Token...`);
  
  let accessToken;
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id,
        client_secret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });
    
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      throw new Error(`OAuth token fetch failed: ${tokenData.error_description || tokenData.error}`);
    }
    accessToken = tokenData.access_token;
    console.log('✅ Access Token acquired successfully.');
  } catch (err) {
    console.error('❌ Failed to fetch access token:', err.message);
    process.exit(1);
  }

  const activeServices = ['ai-agents', 'websites', 'ecommerce', 'automation', 'mvp', 'ai-audit'];
  console.log(`\n🚀 Starting Firestore Seeding for 6 active services...\n`);

  for (const slug of activeServices) {
    try {
      const getUrl = `https://firestore.googleapis.com/v1/projects/ecmdigital-28074/databases/(default)/documents/agency_services/${slug}`;
      const getRes = await fetch(getUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!getRes.ok) {
        console.warn(`⚠️ Warning: Service document '${slug}' does not exist in Firestore (Status: ${getRes.status}). Skipping update.`);
        continue;
      }

      const doc = await getRes.json();
      const docTranslations = doc.fields && doc.fields.translations ? convertFirestoreToValue(doc.fields.translations) : {};
      let updatedCount = 0;

      // Update each language translations with testimonial data
      for (const lang of Object.keys(translations)) {
        const quote = translations[lang][`${slug}.testimonial.quote`];
        const author = translations[lang][`${slug}.testimonial.author`];
        const role = translations[lang][`${slug}.testimonial.role`];

        if (quote && author && role) {
          if (!docTranslations[lang]) {
            docTranslations[lang] = { features: [] };
          }
          docTranslations[lang].testimonialQuote = quote;
          docTranslations[lang].testimonialAuthor = author;
          docTranslations[lang].testimonialRole = role;
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        const patchUrl = `${getUrl}?updateMask.fieldPaths=translations`;
        const patchBody = {
          fields: {
            translations: convertValueToFirestore(docTranslations)
          }
        };

        const patchRes = await fetch(patchUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patchBody)
        });

        if (!patchRes.ok) {
          throw new Error(`Patch failed with status ${patchRes.status}: ${patchRes.statusText}`);
        }

        console.log(`✅ Updated '${slug}' testimonials for ${updatedCount} languages.`);
      } else {
        console.log(`ℹ️ No testimonials found to update for '${slug}'.`);
      }
    } catch (err) {
      console.error(`❌ Error updating service '${slug}':`, err.message);
    }
  }

  console.log('\n🎉 Database seeding completed successfully.');
  process.exit(0);
}

runSeeding();
