const axios = require('axios');

async function testAllDomains() {
  const baseURL = 'http://localhost:3000/api/chat';
  
  const testCases = [
    'مۆبایلی دەستی دووتان هەیە یان هی من دەگۆڕنەوە؟',
    'کامێراکەم تەڵخە و لێڵ پیشان دەدات',
    'مایکرۆفۆنی مۆبایلم لە پەیوەندیدا دەنگ ناڕوات',
    'شەبەکەی مۆبایلم ناخوێنێتەوە و نوسیویەتی No Service',
    'مۆبایلەکەم قوفڵ بووە و پاسۆردم بیرچووەتەوە',
    'کۆدی تێلیگرامم بۆ نایەت چۆن چاکی کەم؟',
    'مۆبایلم کەوتووەتە ئاو چی بکەم؟',
    'ڕۆژانی هەینی کەی کراوەن؟',
    'نرخی شاشەی سامسۆنگ چەندە؟'
  ];

  for (const q of testCases) {
    console.log(`\n======================================================`);
    console.log(`👤 پرسیار: ${q}`);
    const res = await axios.post(baseURL, { message: q });
    console.log(`🤖 وەڵام:\n${res.data.reply}`);
  }
}

testAllDomains();
