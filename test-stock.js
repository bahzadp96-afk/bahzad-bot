const axios = require('axios');

async function testStockResponses() {
  const baseURL = 'http://localhost:3000/api/chat';
  
  const queries = [
    'ئایا ئایفۆن 15 پرۆتان هەیە لە کۆگا؟',
    'شاشەی سامسۆنگ S23 دەستدەکەوێ لەلاتان؟',
    'شەحنی ئەسڵی ماکبۆکتان هەیە؟',
    'کەڤەری شیاومیم دەوێت هەتانە؟',
    'پاتری ئەسڵی ئایفۆن ١١تان هەیە لە دوکان؟'
  ];

  for (const q of queries) {
    console.log(`\n-----------------------------------------------------`);
    console.log(`👤 پرسیاری کڕیار: ${q}`);
    const res = await axios.post(baseURL, { message: q });
    console.log(`🤖 وەڵامی بۆت:\n${res.data.reply}`);
  }
}

testStockResponses();
