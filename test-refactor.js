const { validateUrl, escapeXml } = require('./lib/utils');
const AtomGenerator = require('./lib/atomGenerator');
const RssGenerator = require('./lib/rssGenerator');

console.log('测试公共工具模块:');

// 测试 validateUrl 方法
try {
  validateUrl('https://example.com');
  console.log('✓ validateUrl 测试通过');
} catch (error) {
  console.log('✗ validateUrl 测试失败:', error.message);
}

// 测试 escapeXml 方法
const testText = '<script>alert("test")</script>';
const escapedText = escapeXml(testText);
console.log('✓ escapeXml 测试:', escapedText);

console.log('\n测试生成器类:');

// 测试 AtomGenerator
console.log('测试 AtomGenerator...');
AtomGenerator.generate('https://example.com')
  .then(atomFeed => {
    console.log('✓ AtomGenerator 测试通过');
  })
  .catch(error => {
    console.log('✗ AtomGenerator 测试失败:', error.message);
  });

// 测试 RssGenerator
console.log('测试 RssGenerator...');
RssGenerator.generate('https://example.com')
  .then(rssFeed => {
    console.log('✓ RssGenerator 测试通过');
  })
  .catch(error => {
    console.log('✗ RssGenerator 测试失败:', error.message);
  });
