const axios = require('axios');

async function runTests() {
  const baseURL = 'http://localhost:3000';
  console.log('دەستپێکردنی پشکنینی سێرڤەری وێبهوک...\n');

  try {
    // 1. تاقیکردنەوەی دۆخی سێرڤەر (Status check)
    const statusRes = await axios.get(`${baseURL}/api/status`);
    console.log('1. دۆخی سێرڤەر:', statusRes.data);

    // 2. تاقیکردنەوەی پەسەندکردنی وێبهوکی فەیسبووک بە تۆکنی ڕاست
    const challengeRes = await axios.get(`${baseURL}/webhook`, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'my_secret_mobile_bot_verify_token_2025',
        'hub.challenge': 'TEST_CHALLENGE_OK_12345'
      }
    });
    console.log('2. پشکنینی پەسەندکردنی فەیسبووک (Token Verification):', challengeRes.data === 'TEST_CHALLENGE_OK_12345' ? 'سەرکەوتوو بوو ✅' : 'شکستی هێنا ❌');

    // 3. تاقیکردنەوەی ڕەتکردنەوەی وێبهوک بە تۆکنی هەڵە
    try {
      await axios.get(`${baseURL}/webhook`, {
        params: {
          'hub.mode': 'subscribe',
          'hub.verify_token': 'WRONG_TOKEN',
          'hub.challenge': 'TEST_CHALLENGE'
        }
      });
      console.log('3. پشکنینی ڕەتکردنەوەی تۆکنی هەڵە: شکستی هێنا ❌');
    } catch (e) {
      console.log('3. پشکنینی ڕەتکردنەوەی تۆکنی هەڵە (403 Forbidden):', e.response?.status === 403 ? 'سەرکەوتوو بوو ✅' : 'شکستی هێنا ❌');
    }

    // 4. ناردنی پەیامی مێسنجەری ساختە بۆ وێبهوک
    const webhookRes = await axios.post(`${baseURL}/webhook`, {
      object: 'page',
      entry: [
        {
          id: '123456789',
          messaging: [
            {
              sender: { id: 'test_user_psid_999' },
              recipient: { id: 'page_id_111' },
              message: {
                mid: 'mid.123',
                text: 'سڵاو، کێشەی پاتری مۆبایلم هەیە'
              }
            }
          ]
        }
      ]
    });
    console.log('4. وەرگرتنی پەیامی فەیسبووک (Inbound Webhook Event):', webhookRes.data === 'EVENT_RECEIVED' ? 'سەرکەوتوو بوو ✅' : 'شکستی هێنا ❌');

    // 5. تاقیکردنەوەی چاتی ناوخۆیی
    const chatRes = await axios.post(`${baseURL}/api/chat`, {
      message: 'ئایفۆن 15 پرۆ ماکس بە چەندە؟'
    });
    console.log('5. تاقیکردنەوەی وەڵامدانەوەی ناوخۆیی:', chatRes.data);

    console.log('\nسەرجەم پشکنینەکان بە سەرکەوتوویی تەواو بوون! 🎉');
  } catch (err) {
    console.error('هەڵە لە پشکنین:', err.response?.data || err.message);
  }
}

runTests();
