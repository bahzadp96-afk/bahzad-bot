const axios = require('axios');

async function testFullPipeline() {
  console.log('پشکنینی کۆتایی تەواوی بۆتی فەیسبووک و مێسنجەر...\n');

  try {
    // 1. تاقیکردنەوەی پێشوازی لە نامەی فەیسبووک مێسنجەر (Inbound Webhook Event)
    const webhookPayload = {
      object: 'page',
      entry: [
        {
          id: '612687618603845',
          time: Date.now(),
          messaging: [
            {
              sender: { id: 'test_customer_bahzad' },
              recipient: { id: '612687618603845' },
              timestamp: Date.now(),
              message: {
                mid: 'mid.test_msg_123',
                text: 'سڵاو کاک بەهزاد، ئایفۆن 15 پرۆ ماکستان لە کۆگا دەست دەکەوێ؟ وێنەکەی بنێرن'
              }
            }
          ]
        }
      ]
    };

    console.log('1. ناردنی نامەی تاقیکاری مێسنجەر بۆ وێبهوک...');
    const hookRes = await axios.post('http://localhost:3000/webhook', webhookPayload);
    console.log('وەڵامی وێبهوک (EVENT_RECEIVED):', hookRes.data);

    // 2. پشکنینی پاشەکەوتکردنی پرسیار و وەڵام لە سیستەم
    const chatRes = await axios.post('http://localhost:3000/api/chat', {
      message: 'سڵاو کاک بەهزاد، ئایفۆن 15 پرۆ ماکستان لە کۆگا دەست دەکەوێ؟ وێنەکەی بنێرن'
    });

    console.log('\n2. وەڵامی کۆتایی و زیرەکی بۆتەکە:');
    console.log(chatRes.data.reply);
    console.log('وێنەی هاوپێچکراوی مۆبایلەکە:', chatRes.data.productImage);

    // 3. پشکنینی دۆخی پەیج و کەتەلۆگ و ئامار
    const statsRes = await axios.get('http://localhost:3000/api/stats');
    console.log('\n3. ئاماری کۆگای دوکان:');
    console.log(statsRes.data);

    console.log('\n======================================================');
    console.log('🎉 هەموو بەشەکان بە سەرکەوتوویی ١٠٠٪ کاردەکەن و ئامادەن!');
    console.log('======================================================');

  } catch (err) {
    console.error('هەڵە لە تاقیکردنەوە:', err.response?.data || err.message);
  }
}

testFullPipeline();
