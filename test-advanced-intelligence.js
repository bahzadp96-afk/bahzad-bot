const axios = require('axios');

async function testAdvancedIntelligence() {
  const baseURL = 'http://localhost:3000';
  console.log('پشکنینی توانستە پێشکەوتووەکانی زیرەکی دەستکرد و پرسیارە دەرەکییەکان...\n');

  try {
    // 1. پرسیاری دەرەکی: بەراوردی مۆبایلەکان
    const compRes = await axios.post(`${baseURL}/api/chat`, {
      message: 'جیاوازی نێوان ئایفۆن ١٥ و سامسۆنگ S24 چییە و کامەیان باشترە؟'
    });
    console.log('1. وەڵامی بەراوردی مۆبایلەکان:\n', compRes.data.reply);

    // 2. پرسیاری پێشنیاز بۆ یاری پۆبجی
    const gameRes = await axios.post(`${baseURL}/api/chat`, {
      message: 'مۆبایلم دەوێت بۆ یاری پۆبجی بە ٩٠ فریم چی باشە؟'
    });
    console.log('\n-----------------------------------------------------');
    console.log('2. وەڵامی مۆبایلی گەیمینگ:\n', gameRes.data.reply);

    // 3. تۆمارکردنی حجز و نۆرە لەگەڵ ژمارە تەلەفۆن
    const bookRes = await axios.post(`${baseURL}/api/chat`, {
      message: 'سڵاو دەمەوێت سەردانتان بکەم بۆ گۆڕینی شاشەی ئایفۆن 13، ئەمەش ژمارەکەمە: 07501234567',
      userId: 'customer_ali_99'
    });
    console.log('\n-----------------------------------------------------');
    console.log('3. وەڵامی بۆت بۆ تۆمارکردنی حجز:\n', bookRes.data.reply);

    // 4. پشکنینی ئەوەی حجزەکە تۆمارکراوە لە لیستی داتابەیس
    const allBookings = await axios.get(`${baseURL}/api/bookings`);
    console.log('\n-----------------------------------------------------');
    console.log('4. لیستی حجزە تۆمارکراوەکان لە سیستەم:');
    console.log(allBookings.data.bookings);

  } catch (err) {
    console.error('هەڵە:', err.response?.data || err.message);
  }
}

testAdvancedIntelligence();
