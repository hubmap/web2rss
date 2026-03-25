import WebParser from './parser.js';
import { validateUrl, escapeXml } from './utils.js';

// Atom Feed生成器
class AtomGenerator {
  // 生成Atom Feed
  static async generate(url) {
    try {
      // 验证URL格式
      validateUrl(url);
      
      // 解析网页内容
      const parsedData = await WebParser.parse(url);
      
      // 生成Atom XML
      const atomFeed = this.buildAtomFeed(parsedData, url);
      
      return atomFeed;
    } catch (error) {
      console.error('Error generating Atom feed:', error);
      throw error;
    }
  }

  // 构建Atom Feed XML
  static buildAtomFeed(data, url) {
    const now = new Date().toISOString();
    const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
    const feedUrl = `${baseUrl}/api/atom?url=${encodeURIComponent(url)}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
    xml += `<feed xmlns="http://www.w3.org/2005/Atom">
`;
    xml += `  <title type="text">${escapeXml(data.title)}</title>
`;
    xml += `  <link href="${data.url}" rel="alternate" type="text/html"/>
`;
    xml += `  <link href="${feedUrl}" rel="self" type="application/atom+xml"/>
`;
    xml += `  <id>${data.url}</id>
`;
    xml += `  <updated>${now}</updated>
`;
    xml += `  <author>
`;
    xml += `    <name>Web2RSS</name>
`;
    xml += `  </author>
`;
    xml += `  <subtitle type="text">${escapeXml(data.description)}</subtitle>
`;

    // 添加条目
    data.links.forEach((link, index) => {
      xml += `  <entry>
`;
      xml += `    <title type="text">${escapeXml(link.title)}</title>
`;
      xml += `    <link href="${link.url}" type="text/html"/>
`;
      xml += `    <id>${link.url}#${index}</id>
`;
      xml += `    <updated>${now}</updated>
`;
      xml += `    <summary type="text">${escapeXml(link.title)}</summary>
`;
      xml += `    <author>
`;
      xml += `      <name>Web2RSS</name>
`;
      xml += `    </author>
`;
      xml += `  </entry>
`;
    });

    xml += `</feed>`;
    return xml;
  }


}

export default AtomGenerator;