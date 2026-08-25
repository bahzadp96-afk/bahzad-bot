const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { saveShopSettings, getShopSettings } = require('./src/settingsManager');

const argToken = process.argv[2];
const settings = getShopSettings();
const token = argToken || settings.page_access_token || 'EABAbEuGsWgQBSUoh72o1JAkshSWE564Cydx6Fhf97ZBqrECSHcADshVk52FJYaG0x8etohnAG6kieZB37yv2DvDyXA1XQjcMxIAFm3Md1gO9qWoUuMx9lC1bpwyMg7eH1BlqOOPeWBgfbDX4u2ny98en6ceURZAg76aGiHjsNhAL0jGdZANCs5WuZAOYIAt6IwRnjZAqtY5aDsr4YchoyxjtShpgZDZD';

async function connectPage() {
  console.log('1. پاشەکەوتکردنی Page Access Token لە سیستەم...');
  
  // 1. پاشەکەوتکردن لە Settings
  saveShopSettings({
    page_access_token: token,
    shop_name: 'پەیجی مۆبایلی بەهزاد'
  });

  // 2. پاشەکەوتکردن لە .env
  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('PAGE_ACCESS_TOKEN=')) {
    envContent = envContent.replace(/PAGE_ACCESS_TOKEN=.*/, `PAGE_ACCESS_TOKEN=${token}`);
  } else {
    envContent += `\nPAGE_ACCESS_TOKEN=${token}`;
  }
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('تۆکن پاشەکەوت کرا! ✅');

  // 3. بەستنەوەی فەرمی پەیج بە وێبهوک لە ڕێگەی فەیسبووک Graph API
  console.log('\n2. بەستنەوەی پەیجی فەیسبووک بە ئەپەکە (Subscribed Apps API)...');
  try {
    const subRes = await axios.post(`https://graph.facebook.com/v19.0/me/subscribed_apps`, null, {
      params: {
        subscribed_fields: 'messages,messaging_postbacks,message_deliveries,message_reads',
        access_token: token
      }
    });
    console.log('ئەنجامی بەستنەوەی فەیسبووک:', subRes.data);
    if (subRes.data.success) {
      console.log('\n🎉 پیرۆزە! پەیجی مۆبایلی بەهزاد بە سەرکەوتوویی ١٠٠٪ بەسترایەوە بە بۆتەکە!');
    }
  } catch (err) {
    console.error('هەڵە لە بەستنەوەی API:', err.response?.data || err.message);
  }

  // 4. پشکنینی زانیاری پەیج
  try {
    const pageRes = await axios.get(`https://graph.facebook.com/v19.0/me`, {
      params: {
        fields: 'id,name,link,picture',
        access_token: token
      }
    });
    console.log('\n3. زانیارییەکانی پەیجی بەستراوە:');
    console.log(`- ناوی پەیج: ${pageRes.data.name}`);
    console.log(`- ئایدی پەیج: ${pageRes.data.id}`);
  } catch (err) {
    console.error('هەڵە لە وەرگرتنی زانیاری پەیج:', err.response?.data || err.message);
  }
}

connectPage();
