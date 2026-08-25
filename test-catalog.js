const axios = require('axios');

async function testCatalog() {
  const baseURL = 'http://localhost:3000';
  console.log('پشکنینی کەتەلۆگی کاڵا و نرخەکان...\n');

  try {
    // 1. زیادکردنی کاڵایەکی نوێ
    const addRes = await axios.post(`${baseURL}/api/products`, {
      name: 'سێتی ئۆفەری شەحنی ئەسڵی ئایفۆن (سەری ٢٠ وات + وایەری تایپ سی)',
      price: '٢٠,٠٠٠ دینار',
      description: 'شاحنەی فاست چارژی ئەسڵی بە گرەنتی یەک ساڵ لەگەڵ وایەری تایپ سی کوالێتی بەرز',
      category: 'سێت و باکێج'
    });
    console.log('1. زیادکردنی کاڵا:', addRes.data.message);

    // 2. بینینی لیست
    const listRes = await axios.get(`${baseURL}/api/products`);
    console.log(`2. ژمارەی کاڵاکان: ${listRes.data.products.length}`);

    // 3. پرسیارکردن لە بۆتەکە دەربارەی ئەو سێتە
    const chatRes = await axios.post(`${baseURL}/api/chat`, {
      message: 'سێتی ئۆفەری شەحنی ئایفۆنتان هەیە بە چەندە؟'
    });
    console.log('\n3. وەڵامی بۆت:\n', chatRes.data.reply);

  } catch (err) {
    console.error('هەڵە:', err.response?.data || err.message);
  }
}

testCatalog();
