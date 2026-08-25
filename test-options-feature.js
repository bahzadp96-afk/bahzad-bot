const assert = require('assert');
const { generateAiReply } = require('./src/aiService');
const { getInstantTroubleshootingReply } = require('./src/fastEngine');
const { findMultipleMatchingProducts } = require('./src/productManager');

async function runTests() {
  console.log('🧪 Destpêkirina taqیکردنەوەکانی سیستەمی ئیختیاری کاڵاکان (Selectable Product Options Tests)...\n');

  // Test 1: Category query for Nokia
  console.log('Test 1: پرسیار لەسەر مۆبایلی نۆکیا');
  const nokiaReply = await generateAiReply('user_test_nokia', 'مۆبایلی نۆکیاتان چیتان هەیە؟');
  assert(nokiaReply.options && nokiaReply.options.length >= 5, 'پێویستە لایەنی کەم ٥ هەڵبژاردەی نۆکیا بگەڕێنێتەوە');
  assert(nokiaReply.text.includes('Nokia 105') && nokiaReply.text.includes('1280'), 'پێویستە دەقەکە مۆدێلەکان لەخۆ بگرێت');
  console.log(`✅ نۆکیا سەلمێنرا، ژمارەی هەڵبژاردنەکان: ${nokiaReply.options.length}`);
  console.log(`   هەڵبژاردەی یەکەم: ${nokiaReply.options[0].title}`);
  console.log(`   هەڵبژاردەی دووەم: ${nokiaReply.options[1].title}`);

  // Test 2: Selecting option 2 ("2" -> Nokia 1280)
  console.log('\nTest 2: بەکارهێنەر ژمارە ٢ هەڵدەبژێرێت (2 -> Nokia 1280)');
  const chosenNokia = await generateAiReply('user_test_nokia', '2');
  assert(chosenNokia.text.includes('1280') || chosenNokia.matchedImage?.filename.includes('1280'), 'پێویستە وەڵامی نۆکیا ١٢٨٠ بکاتەوە');
  assert(chosenNokia.matchedImage !== null, 'پێویستە وێنەی کاڵاکە بگەڕێنێتەوە');
  console.log(`✅ دەستنیشانکردن بە ژمارە سەلمێنرا: وێنەی [${chosenNokia.matchedImage.filename}] دۆزرایەوە`);

  // Test 3: Kurdish number selection ("دوو" or "یەکەم")
  console.log('\nTest 3: پرسیار لەسەر یاری و دەستنیشانکردن بە نووسینی "یەکەم"');
  const gameReply = await generateAiReply('user_test_game', 'کۆین و شەحنی یاری چیتان هەیە؟');
  assert(gameReply.options && gameReply.options.length >= 3, 'پێویستە هەڵبژاردەی یارییەکان بگەڕێنێتەوە');
  console.log(`✅ هەڵبژاردنەکانی یاری: ${gameReply.options.map(o => o.title).join(', ')}`);

  const chosenGame = await generateAiReply('user_test_game', 'یەکەم');
  assert(chosenGame.text.includes('تیکتۆک') || chosenGame.matchedImage?.filename.includes('COIN'), 'پێویستە کۆینی تیکتۆک بگەڕێنێتەوە');
  console.log(`✅ دەستنیشانکردن بە وشەی "یەکەم" سەلمێنرا!`);

  // Test 4: Sponsor category
  console.log('\nTest 4: پرسیاری سپۆنسەر و سۆشیاڵ میدیا');
  const sponReply = await generateAiReply('user_test_spon', 'سپۆنسەری پەیجم بۆ دەکەن؟');
  assert(sponReply.options && sponReply.options.length >= 3, 'پێویستە هەڵبژاردەی سپۆنسەر هەبێت');
  console.log(`✅ هەڵبژاردنەکانی سپۆنسەر: ${sponReply.options.map(o => o.title).join(', ')}`);

  // Test 5: Accessories & Chargers
  console.log('\nTest 5: پرسیاری ئیکسسوارات و شەحن');
  const accReply = await generateAiReply('user_test_acc', 'شاحنە و پاوەربانک چیتان هەیە؟');
  assert(accReply.options && accReply.options.length >= 3, 'پێویستە هەڵبژاردەی ئیکسسوارات هەبێت');
  console.log(`✅ هەڵبژاردنەکانی ئیکسسوارات: ${accReply.options.map(o => o.title).join(', ')}`);

  // Test 6: findMultipleMatchingProducts
  console.log('\nTest 6: تاقیکردنەوەی findMultipleMatchingProducts بۆ کلیلەوشەی نۆکیا');
  const multiNokia = findMultipleMatchingProducts('نۆکیا');
  assert(multiNokia.length >= 5, 'پێویستە فرە کاڵای نۆکیا بدۆزێتەوە');
  console.log(`✅ فرە-کاڵا سەرکەوتوو بوو، ژمارەی دۆزراوە: ${multiNokia.length}`);

  console.log('\n🎉 سەرجەم تاقیکردنەوەکانی تایبەتمەندی ئیختیاری (Options) بە 100% سەرکەوتوویی تێپەڕین!');
}

runTests().catch(err => {
  console.error('❌ تاقیکردنەوە سەرکەوتوو نەبوو:', err);
  process.exit(1);
});
