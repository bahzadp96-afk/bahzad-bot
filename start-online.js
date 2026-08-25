const localtunnel = require('localtunnel');
const axios = require('axios');
const config = require('./src/config');
const { getShopSettings } = require('./src/settingsManager');

// دەستپێکردنی سێرڤەری سەرەکی
require('./src/server');

const APP_ID = '4533367536900612';
const APP_SECRET = '722cb6979edf829d95fffe86bf6a2944';
const APP_ACCESS_TOKEN = `${APP_ID}|${APP_SECRET}`;
const PAGE_ID = '612687618603845';

let currentTunnel = null;

async function autoRegisterMetaWebhook(publicUrl) {
  const callbackUrl = `${publicUrl}/webhook`;
  const verifyToken = config.VERIFY_TOKEN;
  const settings = getShopSettings();
  const pageToken = settings.page_access_token || config.PAGE_ACCESS_TOKEN;

  console.log('\n================================================================');
  console.log('🎉 بەستەری گشتی بە سەرکەوتوویی دروستکرا:');
  console.log('================================================================');
  console.log(`🌐 Server URL:   ${publicUrl}`);
  console.log(`🔗 Callback URL: ${callbackUrl}`);
  console.log('================================================================');
  console.log('⚙️ خەریکی خۆبەستنەوەی ئۆتۆماتیکیین لەگەڵ Meta (بێ پێویستی دەستکاری)...');

  try {
    // 1. نوێکردنەوەی ئۆتۆماتیکی وێبهوک لە ناو Meta App
    const subRes = await axios.post(`https://graph.facebook.com/v19.0/${APP_ID}/subscriptions`, null, {
      params: {
        object: 'page',
        callback_url: callbackUrl,
        fields: 'messages,messaging_postbacks,message_deliveries,message_reads',
        verify_token: verifyToken,
        access_token: APP_ACCESS_TOKEN
      }
    });

    if (subRes.data && subRes.data.success) {
      console.log('✅ وێبهوکی فەیسبووک بە شێوازی ١٠٠٪ ئۆتۆماتیکی نوێکرایەوە و پەسەند کرا!');
    }

    // 2. بەستنەوەی پەیجەکە بە وێبهوک
    if (pageToken) {
      const pageSubRes = await axios.post(`https://graph.facebook.com/v19.0/${PAGE_ID}/subscribed_apps`, null, {
        params: {
          subscribed_fields: 'messages,messaging_postbacks,message_deliveries,message_reads',
          access_token: pageToken
        }
      });
      if (pageSubRes.data && pageSubRes.data.success) {
        console.log('✅ پەیجی مۆبایلی بەهزاد بە سەرکەوتوویی بەسترایەوە بە نامەکان!');
      }
    }

    console.log('\n🚀 بۆتەکە بە تەواوی ئامادەیە و وەڵامی نامەکان دەداتەوە!\n');
  } catch (err) {
    console.log('⚠️ تێبینی لە خۆبەستنەوە:', err.response ? err.response.data?.error?.message : err.message);
  }
}

async function startTunnel() {
  try {
    console.log('خەریکی دروستکردنی ناونیشانی پارێزراوی ئینتەرنێت (HTTPS Public Webhook URL)...');
    
    currentTunnel = await localtunnel({ port: config.PORT });

    await autoRegisterMetaWebhook(currentTunnel.url);

    currentTunnel.on('close', () => {
      console.log('⚠️ ڕاڕەوی ئینتەرنێت داخرا، خەریکی دەستپێکردنەوەین...');
      setTimeout(startTunnel, 3000);
    });

    currentTunnel.on('error', (err) => {
      console.error('⚠️ هەڵە لە ڕاڕەو:', err.message);
      try { currentTunnel.close(); } catch(e) {}
      setTimeout(startTunnel, 3000);
    });

  } catch (err) {
    console.error('نەتوانرا بەستەری گشتی دروست بکرێت:', err.message);
    setTimeout(startTunnel, 5000);
  }
}

// دەستپێکردن
startTunnel();


