const axios = require('axios');

async function testAutoImageSending() {
  const baseURL = 'http://localhost:3000';
  console.log('پشکنینی دۆزینەوە و ناردنی وێنەی کاڵا بەپێی ناوی وێنەکانی دیسکتۆپ...\n');

  try {
    // 1. پرسیار لەسەر ئایفۆن 15 پرۆ ماکس
    const res1 = await axios.post(`${baseURL}/api/chat`, {
      message: 'سڵاو، ئایفۆن 15 پرۆ ماکستان دەست دەکەوێ؟ وێنەکەی بنێرە'
    });
    console.log('1. وەڵامی پرسیاری ئایفۆن 15 پرۆ ماکس:');
    console.log('وەڵام:\n', res1.data.reply);
    console.log('وێنەی دۆزراوە بۆ ناردن:', res1.data.productImage);

    // 2. پرسیار لەسەر سێتی کەڤەر و لەزگە
    const res2 = await axios.post(`${baseURL}/api/chat`, {
      message: 'سێتی کەڤەر و لەزگەتان هەیە؟'
    });
    console.log('\n-----------------------------------------------------');
    console.log('2. وەڵامی پرسیاری سێتی کەڤەر و لەزگە:');
    console.log('وەڵام:\n', res2.data.reply);
    console.log('وێنەی دۆزراوە بۆ ناردن:', res2.data.productImage);

  } catch (err) {
    console.error('هەڵە:', err.response?.data || err.message);
  }
}

testAutoImageSending();
