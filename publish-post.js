const { publishPostToFacebook, getNextProductToPost, getAutoPostSettings } = require('./src/autoPoster');

async function main() {
  console.log('===============================================================');
  console.log('📢 سیستەمی بڵاوکردنەوەی پۆستی فەرمی بۆ پەیجی فەیسبووک');
  console.log('===============================================================\n');

  const next = getNextProductToPost();
  if (!next) {
    console.error('❌ هیچ بەرهەمێک لە STOREG بەردەست نییە.');
    process.exit(1);
  }

  console.log(`📦 بەرهەمی لە نۆرەدراو: "${next.kbItem.name}"`);
  console.log(`🖼️ وێنە: ${next.kbItem.filename}`);
  console.log('\n📝 دەقی ئامادەکراو بۆ فەیسبووک:');
  console.log('---------------------------------------------------------------');
  console.log(next.caption);
  console.log('---------------------------------------------------------------\n');

  const args = process.argv.slice(2);
  const isDryRun = args.includes('--preview') || args.includes('-p');

  if (isDryRun) {
    console.log('🔍 دۆخی پێشبینین (--preview): هیچ پۆستێک نەنێردرا بۆ فەیسبووک.');
    process.exit(0);
  }

  console.log('🚀 خەریکی پەیوەندیکردن بە Facebook Graph API و بڵاوکردنەوەی پۆست...');
  const result = await publishPostToFacebook();

  if (result.success) {
    console.log('\n🎉 پیرۆزە! پۆستەکە بە سەرکەوتوویی لە پەیج بڵاوکرایەوە!');
    console.log(`🔗 بەستەری پۆست لە فەیسبووک: ${result.facebook_link || result.post_id}`);
  } else {
    console.error('\n❌ هەڵە لە بڵاوکردنەوە:', result.error);
  }
}

main();
