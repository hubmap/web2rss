import RSS from 'rss';
import WebParser from './parser.js';
import { validateUrl, escapeXml } from './utils.js';

// RSS Feed生成器
class RssGenerator {
  // 生成RSS Feed
  static async generate(url) {
    try {
      // 验证URL格式
      validateUrl(url);
      
      // 解析网页内容
      const parsedData = await WebParser.parse(url);
      
      // 创建RSS实例
      const feed = new RSS({
        title: escapeXml(parsedData.title),
        description: escapeXml(parsedData.description),
        feed_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/rss?url=${encodeURIComponent(url)}`,
        site_url: parsedData.url,
        language: 'zh-CN',
        pubDate: new Date().toISOString(),
        ttl: 60
      });

      // 添加链接到Feed
      parsedData.links.forEach(link => {
        feed.item({
          title: escapeXml(link.title),
          description: escapeXml(link.title),
          url: link.url,
          guid: link.url,
          date: new Date().toISOString()
        });
      });

      // 返回RSS XML
      return feed.xml();
    } catch (error) {
      console.error('Error generating RSS feed:', error);
      throw error;
    }
  }


}

export default RssGenerator;