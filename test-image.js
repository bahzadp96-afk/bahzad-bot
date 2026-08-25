const axios = require('axios');

async function testImageChat() {
  const baseURL = 'http://localhost:3000';
  console.log('دەستپێکردنی تاقیکردنەوەی ناردنی وێنە و شیکردنەوە...\n');

  // وێنەیەکی ساختەی کەم قەبارە بە شێوازی Base64
  const sample1x1PngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  try {
    // 1. تاقیکردنەوەی ناردنی دەق + وێنە بۆ API
    const res1 = await axios.post(`${baseURL}/api/chat`, {
      message: 'سەیری ئەم وێنەیەی شاشەی مۆبایلەکەم بکە تکایە',
      image: sample1x1PngBase64
    });
    console.log('1. وەڵام بۆ پرسیاری دەق + وێنە:\n', res1.data.reply);

    // 2. تاقیکردنەوەی وەرگرتنی وێنە لە ڕێگەی Facebook Inbound Webhook
    const webhookRes = await axios.post(`${baseURL}/webhook`, {
      object: 'page',
      entry: [
        {
          id: '123456789',
          messaging: [
            {
              sender: { id: 'test_user_with_photo_888' },
              recipient: { id: 'page_id_111' },
              message: {
                mid: 'mid.456',
                attachments: [
                  {
                    type: 'image',
                    payload: {
                      url: 'https://via.placeholder.com/150'
                    }
                  }
                ]
              }
            }
          ]
        }
      ]
    });
    console.log('\n2. پشکنینی وەرگرتنی وێنەی فەیسبووک (Webhook Image Attachment):', webhookRes.data === 'EVENT_RECEIVED' ? 'سەرکەوتوو بوو ✅' : 'شکستی هێنا ❌');

  } catch (err) {
    console.error('هەڵە لە تاقیکردنەوە:', err.response?.data || err.message);
  }
}

testImageChat();
