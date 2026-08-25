const { generateAiReply } = require('./src/aiService');
const { getAllProducts, getStoregImages } = require('./src/productManager');

async function runAllTests() {
  console.log('====================================================');
  console.log('🚀 تاقیکردنەوەی خێرایی و وەڵامدانەوەی زیرەکی دەستکرد');
  console.log('====================================================\n');

  // ١. پشکنینی کەتەلۆگ
  const allProds = getAllProducts();
  const storegImgs = getStoregImages();
  console.log(`📦 کۆی کاڵاکان لە کەتەلۆگ: ${allProds.length}`);
  console.log(`🖼️ کۆی وێنەکانی STOREG: ${storegImgs.length}\n`);

  const testCases = [
    { name: 'Nokia 105', msg: 'نۆکیا ١٠٥تان دەست دەکەوێت؟' },
    { name: 'Nokia 1280', msg: 'مۆبایلی نۆکیا 1280 ئەفسانەییتان هەیە؟' },
    { name: 'Nokia 6300 4G', msg: 'نۆکیا ٦٣٠٠ 4g واتسئەپ کاردەکات؟' },
    { name: 'TikTok Coins', msg: 'کۆینی تیکتۆکم دەوێت بۆ لایڤ و دیاری' },
    { name: 'Free Fire', msg: 'شەحنی دایمۆندی فریفایەر بە ئایدی دەکەن؟' },
    { name: 'Roblox', msg: 'ڕۆبۆکسی یاری ڕۆبلۆکستان هەیە؟' },
    { name: 'Steam', msg: 'کارتی ستیمتان هەیە بۆ کۆمپیوتەر؟' },
    { name: 'Facebook Sponsor', msg: 'خزمەتگوزاری سپۆنسەری فەرمی پەیجم دەوێت' },
    { name: 'Comment Bot', msg: 'سیستەمی بۆتی کۆمێنت دادەنێن؟' },
    { name: 'Nokia Keypad Collection', msg: 'چ جۆرە مۆبایلێکی نۆکیای دوگمەییتان هەیە؟' },
    { name: 'PC Blue Screen', msg: 'شاشەی شینی کۆمپیوتەرەکەم چۆن چاک بکەم؟' }
  ];

  let passed = 0;
  for (const tc of testCases) {
    const startTime = Date.now();
    const result = await generateAiReply('test_user_qa', tc.msg);
    const duration = Date.now() - startTime;

    console.log(`----------------------------------------------------`);
    console.log(`🧪 تێست: [${tc.name}]`);
    console.log(`👤 پرسیار: "${tc.msg}"`);
    console.log(`⚡ خێرایی وەڵام: ${duration}ms`);
    console.log(`🖼️ وێنەی هاوپێچ: ${result.matchedImage ? result.matchedImage.url : 'نییە'}`);
    console.log(`🤖 پوختەی وەڵام: ${result.text.substring(0, 90).replace(/\n/g, ' ')}...`);

    if (result && result.text && result.text.length > 20) {
      passed++;
    } else {
      console.error(`❌ وەڵام کێشەی هەیە!`);
    }
  }

  console.log(`\n====================================================`);
  console.log(`🎯 ئەنجام: ${passed} لە ${testCases.length} تاقیکردنەوە سەرکەوتوو بوو! 🎉`);
  console.log(`====================================================`);
}

runAllTests();
