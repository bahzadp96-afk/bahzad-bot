const assert = require('assert');
const {
  getAllCustomKnowledge,
  addCustomKnowledge,
  updateCustomKnowledge,
  deleteCustomKnowledge,
  findMatchingCustomKnowledge
} = require('./src/customKnowledgeManager');
const { generateAiReply } = require('./src/aiService');

async function testOwnerAndKnowledgeSuite() {
  console.log('👑 دەستپێکردنی تاقیکردنەوەی ناساندنی شارەزای سۆشیاڵ میدیا و زانیارییە تایبەتەکان...\n');

  // ========================================================
  // ١. تاقیکردنەوەی ناساندنی خاوەنی دوکان و شارەزای سۆشیاڵ میدیا
  // ========================================================
  console.log('1️⃣ تاقیکردنەوەی پرسیار دەربارەی خاوەنی پەیج و شارەزای سۆشیاڵ میدیا:');
  const ownerRes = await generateAiReply('test_user_owner', 'شارەزای سۆشیاڵ میدیا و خاوەنی پەیج کێیە؟');
  assert.ok(ownerRes.text.includes('شارەزای سۆشیاڵ میدیا'), 'دەبێت ناوی شارەزای سۆشیاڵ میدیا هەبێت');
  assert.ok(ownerRes.text.includes('بەهزاد صباح ممند') || ownerRes.text.includes('بهزاد صباح ممند'), 'دەبێت ناوی بەهزاد صباح ممند هەبێت');
  assert.ok(ownerRes.text.includes('خاوەنی مۆبایلی بهزاد') || ownerRes.text.includes('خاوەنی مۆبایلی بەهزاد'), 'دەبێت خاوەنی مۆبایلی بەهزاد هەبێت');
  console.log('   ✅ وەڵامی ناساندن بە سەرکەوتوویی درایەوە:');
  console.log('   ' + ownerRes.text.split('\n')[3] + '\n');

  // ========================================================
  // ٢. تاقیکردنەوەی زیادکردنی زانیاری تایبەت لەلایەن بەکارهێنەر
  // ========================================================
  console.log('2️⃣ تاقیکردنەوەی داخڵکردنی زانیاری تایبەت بۆ ناو سیستەم (CRUD):');
  const addRes = addCustomKnowledge({
    topic: 'ئۆفەری شەوانی جەژن',
    keywords: 'ئۆفەری جەژن, دیاری جەژن, داشکاندنی جەژن',
    answer: 'لە شەوانی جەژندا ٢٠٪ داشکاندنمان هەیە بۆ هەموو ئیکسسواراتەکان و گۆڕینی لەزگە بە بێبەرامبەرە!'
  });
  assert.ok(addRes.success && addRes.item.id);
  console.log(`   ✅ زانیاری نوێ زیادکرا: ID = ${addRes.item.id}`);

  // پشکنینی گەڕان بەپێی وشەی سەرەکی
  const match = findMatchingCustomKnowledge('داشکاندنی جەژنتان هەیە؟');
  assert.ok(match && match.topic === 'ئۆفەری شەوانی جەژن');
  console.log(`   ✅ دۆزینەوەی خێرای وشە: "${match.topic}"`);

  // پشکنینی وەڵامی بۆت بۆ ئەم زانیارییە داخڵکراوە
  const botCustomRes = await generateAiReply('test_user_custom', 'داشکاندنی جەژنتان هەیە بۆ کاڵاکان؟');
  assert.ok(botCustomRes.text.includes('ئۆفەری شەوانی جەژن') && botCustomRes.text.includes('داشکاندنمان هەیە'));
  console.log('   ✅ بۆت دەستبەجێ بەپێی زانیارییە نوێیەکە وەڵامی دایەوە.');

  // دەستکاریکردن
  const updateRes = updateCustomKnowledge(addRes.item.id, {
    answer: 'لە جەژندا ٢٥٪ داشکاندنمان هەیە!'
  });
  assert.ok(updateRes.success && updateRes.item.answer.includes('٢٥٪'));
  console.log('   ✅ دەستکاریکردنی زانیاری بە سەرکەوتوویی تێپەڕی.');

  // سڕینەوە
  const deleteRes = deleteCustomKnowledge(addRes.item.id);
  assert.ok(deleteRes.success);
  console.log('   ✅ سڕینەوەی زانیاری بە سەرکەوتوویی تێپەڕی.');

  // ========================================================
  // ٣. تاقیکردنەوەی خێرایی وەڵامدانەوە (Ultra-Fast Response Time)
  // ========================================================
  console.log('\n3️⃣ پشکنینی خێرایی بروسکەیی وەڵامدانەوە (Response Speed):');
  const tStart = Date.now();
  const fastRes = await generateAiReply('test_user_speed', 'مۆبایلی نۆکیا ١٠٥تان هەیە؟');
  const duration = Date.now() - tStart;
  console.log(`   ⚡ کاتی وەڵامدانەوە: ${duration} میلی چرکە (ms)`);
  assert.ok(duration < 200, 'دەبێت لە کەمتر لە ٢٠٠ میلی چرکە وەڵام بداتەوە');
  console.log('   ✅ خێرایی وەڵامدانەوە بەرز و بروسکەییە.');

  console.log('\n🎉 سەرجەم تاقیکردنەوەکانی ناساندنی شارەزای سۆشیاڵ میدیا و بەڕێوەبردنی زانیارییە تایبەتەکان بە 100% سەرکەوتوویی تێپەڕین!');
}

testOwnerAndKnowledgeSuite().catch(err => {
  console.error('❌ هەڵە لە تاقیکردنەوە:', err);
  process.exit(1);
});
