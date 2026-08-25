const fs = require('fs');
const path = require('path');
const {
  getAutoPostSettings,
  saveAutoPostSettings,
  getNextProductToPost,
  generateMarketingCaption,
  getPostHistory
} = require('./src/autoPoster');
const { STOREG_KNOWLEDGE_BASE, STOREG_DIR } = require('./src/productManager');

console.log('===============================================================');
console.log('🧪 تاقیکردنەوەی سیستەمی پۆستکردنی خۆکاری هەفتانە (٧ ڕۆژ جارێک)');
console.log('===============================================================\n');

// ١. پشکنینی ڕێکخستنەکان
const initialSettings = getAutoPostSettings();
console.log('1. پشکنینی خوێندنەوەی ڕێکخستنەکان:');
console.log(`   - دۆخی کاراکردن: ${initialSettings.enabled ? 'چالاکە ✅' : 'ناچالاکە'}`);
console.log(`   - ماوەی پۆستکردن: هەموو ${initialSettings.interval_days} ڕۆژ جارێک`);

// ٢. پشکنینی دروستکردنی دەقی مارکێتینگی هەموو بەرهەمەکانی STOREG
console.log('\n2. پشکنینی دەقی مارکێتینگ و وێنەی سەرجەم بەرهەمەکانی STOREG:');
let missingImages = 0;
let generatedCaptionsCount = 0;

for (const item of STOREG_KNOWLEDGE_BASE) {
  const imgPath = path.join(STOREG_DIR, item.filename);
  const exists = fs.existsSync(imgPath);
  if (!exists) {
    console.error(`   ❌ وێنە نەدۆزرایەوە: ${item.filename}`);
    missingImages++;
  }

  const caption = generateMarketingCaption(item);
  if (caption && caption.length > 50) {
    generatedCaptionsCount++;
  } else {
    console.error(`   ❌ کێشە لە دروستکردنی دەق بۆ: ${item.name}`);
  }
}

console.log(`   ✅ کۆی بەرهەمە سەرکەوتووەکان: ${generatedCaptionsCount} لە ${STOREG_KNOWLEDGE_BASE.length}`);
if (missingImages > 0) {
  console.error(`   ❌ ${missingImages} وێنە بێسەروشوێنە!`);
}

// ٣. پشکنینی خولانەوە و هەڵبژاردنی بەرهەمی لە نۆرەدراو (Next Product Rotation)
console.log('\n3. پشکنینی نۆرە و خولانەوەی بەرهەمەکان (Rotation Queue):');
const next1 = getNextProductToPost();
console.log(`   - بەرهەمی یەکەمی نۆرە: "${next1.kbItem.name}" (${next1.kbItem.filename})`);
console.log(`   - دەستپێکی دەقی پۆست:\n${next1.caption.substring(0, 140)}...\n`);

// ٤. پشکنینی مێژووی پۆستەکان
const history = getPostHistory();
console.log(`4. پشکنینی مێژووی پۆستەکان: ${history.length} تۆمار دۆزرایەوە.`);

console.log('\n===============================================================');
if (missingImages === 0 && generatedCaptionsCount === STOREG_KNOWLEDGE_BASE.length) {
  console.log('🎉 پیرۆزە! هەموو پشکنینەکانی سیستەمی پۆستی خۆکار بە سەرکەوتوویی تێپەڕین!');
} else {
  console.error('❌ هەندێک لە پشکنینەکان شکستیان هێنا!');
  process.exit(1);
}
console.log('===============================================================');
