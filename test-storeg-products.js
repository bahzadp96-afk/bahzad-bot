const path = require('path');
const fs = require('fs');
const { getStoregImages, findMatchingProductImage, getAllProducts } = require('./src/productManager');
const { getInstantTroubleshootingReply } = require('./src/fastEngine');

console.log('===============================================================');
console.log('🔍 دەستپێکردنی تاقیکردنەوەی هەمەلایەنەی کاڵاکانی بەشی STOREG');
console.log('===============================================================\n');

// ١. پشکنینی خوێندنەوەی وێنەکانی STOREG
const storegImages = getStoregImages();
console.log(`✅ کۆی وێنە و کاڵاکانی دۆزراوە لە STOREG: ${storegImages.length} وێنە`);
if (storegImages.length === 0) {
  console.error('❌ هیچ وێنەیەک نەدۆزرایەوە لە STOREG!');
  process.exit(1);
}

// ٢. لیستی تاقیکردنەوەی پرسیارە جیاوازەکانی کڕیاران
const testQueries = [
  // مۆبایلەکانی نۆکیا بە کوردی و عەرەبی و ئینگلیزی
  { query: 'مۆبایلی نۆکیا ١٠٥تان دەست دەکەوێ؟ وێنەکەی بنێرە', expectedFile: 'nokia' },
  { query: 'نۆکیا 105 نوێم دەوێت', expectedFile: 'nokia105 NEW.png' },
  { query: 'نوکیا ١٠٦ بە چەندە؟', expectedFile: 'nokia106.png' },
  { query: 'مۆبایلی نۆکیا ١٢٥تان هەیە؟', expectedFile: 'nokia125.png' },
  { query: 'نۆکیا ١٢٨٠ ئەفسانەییتان لایە؟', expectedFile: 'nokia1280.png' },
  { query: 'مۆبایلی نۆکیا 150 نوێ', expectedFile: 'nokia 150new.png' },
  { query: 'نۆکیا ٢٠٦تان هەیە؟', expectedFile: 'nokia206.png' },
  { query: 'نۆکیا ٢٠٨', expectedFile: 'nokia208.png' },
  { query: 'نۆکیا ٢٢٠ فۆڕجی 4g', expectedFile: 'nokia220.png' },
  { query: 'نۆکیا ٢٢٥ فۆڕجیم دەوێت', expectedFile: 'nokia225.png' },
  { query: 'مۆبایلی نۆکیا ٣٣١٠ نوێ', expectedFile: 'nokia3310i.png' },
  { query: 'نۆکیا ٥٣١٠ میوزیک دەنگ بەرز', expectedFile: 'nokia5310_.png' },
  { query: 'نۆکیا ٦٣٠٠ 4g واتسئەپ کاردەکات؟', expectedFile: 'nokia6300 G4.png' },
  { query: 'نۆکیا ٦٣١٠ شاشە گەورە بۆ باوکم دەوێت', expectedFile: 'nokia6310.png' },
  { query: 'نۆکیا ٨٢١٠ فۆڕجی 8210', expectedFile: 'nokia8210.png' },

  // کۆین و کارتی یارییەکان
  { query: 'کۆینی تیکتۆکم دەوێت بۆ لایڤ و دیاری', expectedFile: 'COIN TIKTOK.jpg' },
  { query: 'دایمۆندی فریفایەر بە ئایدی بارگاوی دەکەن؟', expectedFile: 'FREE FIRE.jpg' },
  { query: 'ڕۆبۆکسی یاری ڕۆبلۆکستان هەیە بە چەندە؟', expectedFile: 'ROBLOX.jpg' },
  { query: 'کارتی ستیمتان هەیە بۆ یارییەکانی کۆمپیوتەر؟', expectedFile: 'STEAM.jpg' },

  // سپۆنسەر و سۆشیاڵ میدیا و دوکان
  { query: 'خزمەتگوزاری سپۆنسەری فەرمی پەیجم دەوێت', expectedFile: 'SPONSER.jpg' },
  { query: 'دروستکردن و بەڕێوەبردنی پەیجی فەیسبووک دەکەن؟', expectedFile: 'FACEBOOK PAGE.jpg' },
  { query: 'بۆتی کۆمێنت بۆ پەیج دادەنێن؟', expectedFile: 'comment-bot-ad-with-store-logo.png' },
  { query: 'کارتی بازرگانی دوکان و ناونیشانتان بنێرە', expectedFile: 'BUSSNUS CARD.jpg' }
];

let passedCount = 0;
let failedCount = 0;

for (const t of testQueries) {
  const match = findMatchingProductImage(t.query);
  const instantReply = getInstantTroubleshootingReply(t.query);

  if (match && match.filename.toLowerCase().includes(t.expectedFile.toLowerCase().replace(/\.png|\.jpg/, ''))) {
    console.log(`✅ سەرکەوت: "${t.query}"`);
    console.log(`   🖼️ وێنە: ${match.filename} | بەستەر: ${match.url}`);
    console.log(`   📝 وەڵام: ${instantReply?.text.substring(0, 70).replace(/\n/g, ' ')}...\n`);
    passedCount++;
  } else {
    console.error(`❌ شکست: "${t.query}"`);
    console.error(`   چاودەڕوانی: ${t.expectedFile} | دۆزراوە: ${match ? match.filename : 'هیچ'}\n`);
    failedCount++;
  }
}

// ٣. پشکنینی پرسیارە گشتییەکان (General Category Inquiries)
console.log('---------------------------------------------------------------');
console.log('📋 پشکنینی وەڵامی پرسیارە گشتی و کەتەلۆگییەکان:');
const categoryQueries = [
  'چ جۆرە مۆبایلێکی نۆکیای دوگمەییتان هەیە لە کۆگا؟',
  'شەحنی چ یارییەکانێک دەکەن کۆینتان چی هەیە؟',
  'خزمەتگوزاری سپۆنسەر و ڕیکلامی پەیجتان چۆنە؟'
];

for (const cq of categoryQueries) {
  const reply = getInstantTroubleshootingReply(cq);
  if (reply && reply.text && reply.text.length > 100) {
    console.log(`✅ سەرکەوت بۆ پرسیاری گشتی: "${cq}"`);
    console.log(`   📝 وەڵامی ڕێکخراو:\n${reply.text.substring(0, 150)}...\n`);
    passedCount++;
  } else {
    console.error(`❌ شکست بۆ پرسیاری گشتی: "${cq}"`);
    failedCount++;
  }
}

console.log('===============================================================');
console.log(`🎯 ئەنجامی تاقیکردنەوە: ${passedCount} سەرکەوتوو | ${failedCount} شکستهێناو`);
console.log('===============================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 هەموو پشکنینەکان بە سەرکەوتوویی تەواو بوون!');
}
