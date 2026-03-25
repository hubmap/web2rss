import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// 网页解析工具
class WebParser {
  // 获取网页内容（添加超时处理）
  static async fetchContent(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch(url, {
        signal: controller.signal,
        timeout: 10000, // 添加超时选项
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 10 seconds');
      }
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  // 解析网页内容（优化性能）
  static parseContent(html, url) {
    try {
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
      
      // 优先提取有意义的链接
      // 1. 首先尝试提取主要内容区域的链接
      const mainContentSelectors = ['main', 'article', '.main-content', '.content', '.article', '.post', '.list', '.news-list', '.article-list'];
      let mainContent = null;
      
      for (const selector of mainContentSelectors) {
        if ($(selector).length > 0) {
          mainContent = $(selector);
          break;
        }
      }
      
      if (mainContent) {
        // 从主要内容区域提取链接
        mainContent.find('a').each((i, el) => {
          if (linkCount >= maxLinks) return false;
          
          const href = $(el).attr('href');
          const linkText = $(el).text().trim();
          if (href && linkText && linkText.length > 3) { // 过滤太短的链接文本
            // 处理相对链接
            const absoluteUrl = this.resolveUrl(href, url);
            // 过滤重复链接
            if (!links.some(link => link.url === absoluteUrl)) {
              links.push({
                title: linkText,
                url: absoluteUrl
              });
              linkCount++;
            }
          }
        });
      }
      
      // 如果主要内容区域没有足够的链接，从整个页面提取
      if (links.length < 10) {
        $('a').each((i, el) => {
          if (linkCount >= maxLinks) return false;
          
          const href = $(el).attr('href');
          const linkText = $(el).text().trim();
          if (href && linkText && linkText.length > 3) {
            const absoluteUrl = this.resolveUrl(href, url);
            if (!links.some(link => link.url === absoluteUrl)) {
              links.push({
                title: linkText,
                url: absoluteUrl
              });
              linkCount++;
            }
          }
        });
      }

      return {
        title,
        description,
        links,
        url
      };
    } catch (error) {
      console.error('Error parsing content:', error);
      // 返回默认值，确保即使解析失败也能生成订阅源
      return {
        title: 'Untitled',
        description: '',
        links: [],
        url
      };
    }
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