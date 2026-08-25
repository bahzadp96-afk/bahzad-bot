const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Bahzad\\Desktop\\کۆگای پەیجی مۆبایلی بەهزاد\\وێنەی کاڵاکان';
const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

fs.writeFileSync(path.join(dir, 'ئایفۆن 15 پرۆ ماکس.png'), Buffer.from(samplePngBase64, 'base64'));
fs.writeFileSync(path.join(dir, 'سێتی کەڤەر و لەزگە.png'), Buffer.from(samplePngBase64, 'base64'));

console.log('وێنە نموونەییەکان بە سەرکەوتوویی دروستکران لە بوخچەی دیسکتۆپ!');
