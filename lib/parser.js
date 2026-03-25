import fetch from 'node-fetch';
import cheerio from 'cheerio';

// 网页解析工具
class WebParser {
  // 获取网页内容（添加超时处理）
  static async fetchContent(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时
      
      const response = await fetch(url, {
        signal: controller.signal,
        timeout: 3000 // 添加超时选项
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 3 seconds');
      }
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  // 解析网页内容（优化性能）
  static parseContent(html, url) {
    const $ = cheerio.load(html);
    
    // 提取标题
    let title = $('title').text().trim();
    if (!title) {
      title = $('h1').first().text().trim() || 'Untitled';
    }

    // 提取描述
    let description = $('meta[name="description"]').attr('content') || '';
    if (!description) {
      description = $('p').first().text().trim() || '';
    }

    // 提取链接（限制数量，避免过多链接导致性能问题）
    const links = [];
    let linkCount = 0;
    const maxLinks = 50; // 限制最多提取50个链接
    
    $('a').each((i, el) => {
      if (linkCount >= maxLinks) return false; // 达到限制后停止
      
      const href = $(el).attr('href');
      const linkText = $(el).text().trim();
      if (href && linkText) {
        // 处理相对链接
        const absoluteUrl = this.resolveUrl(href, url);
        links.push({
          title: linkText,
          url: absoluteUrl
        });
        linkCount++;
      }
    });

    return {
      title,
      description,
      links,
      url
    };
  }

  // 解析网页并返回结构化数据
  static async parse(url) {
    try {
      const html = await this.fetchContent(url);
      return this.parseContent(html, url);
    } catch (error) {
      console.error('Error parsing web page:', error);
      throw error;
    }
  }

  // 解析相对链接为绝对链接
  static resolveUrl(relativeUrl, baseUrl) {
    try {
      return new URL(relativeUrl, baseUrl).href;
    } catch (error) {
      return relativeUrl;
    }
  }
}

export default WebParser;