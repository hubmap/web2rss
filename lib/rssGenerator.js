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
      const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
      const feedUrl = `${baseUrl}/api/rss?url=${encodeURIComponent(url)}`;
      
      const feed = new RSS({
        title: escapeXml(parsedData.title),
        description: escapeXml(parsedData.description) || `从 ${parsedData.title} 生成的 RSS 订阅源`,
        feed_url: feedUrl,
        site_url: parsedData.url,
        language: 'zh-CN',
        pubDate: new Date().toISOString(),
        ttl: 60,
        generator: `Web2RSS 1.0 (${baseUrl})`
      });

      // 添加链接到Feed
      parsedData.links.forEach((link, index) => {
        feed.item({
          title: escapeXml(link.title),
          description: escapeXml(link.title),
          url: link.url,
          guid: `${link.url}#${index}`,
          date: new Date().toISOString(),
          author: 'Web2RSS'
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