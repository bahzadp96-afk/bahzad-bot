const axios = require('axios');

async function testMultipleQuestions() {
  const baseURL = 'http://localhost:3000/api/chat';
  
  const testCases = [
    'سڵاو کاکە باشی؟',
    'پاتری ئایفۆنەکەم زوو دادەبەزێت چی بکەم؟',
    'ئایفۆن 14 پرۆ ماکس بە چەندە؟',
    'سناپەکەم قوفڵ بووە چۆن بیکەمەوە؟',
    'فەیسبووکم هاککراوە چۆن بیگەڕێنمەوە؟',
    'کاتی دەوامتان کەی بۆ کەیە؟',
    'لە کوێن و ناونیشانتان لە کوێیە؟'
  ];

  for (const question of testCases) {
    console.log(`\n==============================================`);
    console.log(`👤 پرسیاری کڕیار: ${question}`);
    const res = await axios.post(baseURL, { message: question });
    console.log(`🤖 وەڵامی بۆتی AI:\n${res.data.reply}`);
  }
}

testMultipleQuestions();
