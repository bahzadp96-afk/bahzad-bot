/**
 * تاقیکردنەوەی خێرای وەڵامدانەوەی زیرەکی دەستکرد و پشکنینی یاساکان
 */
const { getSystemPrompt } = require('./src/systemPrompt');
const { generateAiReply } = require('./src/aiService');

console.log('----------------------------------------------------');
console.log('پشکنینی پرۆمتی سیستەم:');
console.log('----------------------------------------------------');
console.log(getSystemPrompt());
console.log('----------------------------------------------------');
console.log('سیستەم ئامادەیە بۆ کارکردن.');
