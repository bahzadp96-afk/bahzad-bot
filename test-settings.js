const axios = require('axios');

async function testSettingsApi() {
  const baseURL = 'http://localhost:3000';
  console.log('پشکنینی بەشی ڕێکخستنی زانیارییەکانی دوکان...\n');

  try {
    // 1. وەرگرتنی زانیارییەکان
    const getRes = await axios.get(`${baseURL}/api/settings`);
    console.log('1. زانیارییەکانی ئێستا:\n', getRes.data.settings);

    // 2. تاقیکردنەوەی دەستکاریکردن و پاشەکەوتکردن
    const postRes = await axios.post(`${baseURL}/api/settings`, {
      shop_name: 'دوکانی مۆبایلی پێشکەوتوو (تێست)',
      shop_address: 'سلێمانی، شەقامی سالم',
      shop_phone: '07501112233'
    });
    console.log('\n2. پاشەکەوتکردنی زانیارییەکان:', postRes.data);

    // 3. تاقیکردنەوەی چاتی ناوخۆیی بۆ دڵنیابوون لەوەی ناوی نوێ لە وەڵامدا دەردەکەوێت
    const chatRes = await axios.post(`${baseURL}/api/chat`, {
      message: 'ناونیشانی دوکانتان لە کوێیە؟'
    });
    console.log('\n3. وەڵامی بۆت بە زانیارییە نوێیەکان:\n', chatRes.data.reply);

  } catch (err) {
    console.error('هەڵە:', err.response?.data || err.message);
  }
}

testSettingsApi();
