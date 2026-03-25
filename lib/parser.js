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

      // 提取文章信息（标题、链接、发布时间）
      const links = [];
      let linkCount = 0;
      const maxLinks = 50; // 限制最多提取50个链接
      
      // 文章列表选择器
      const articleSelectors = [
        '.news-item', '.article-item', '.list-item', '.item',
        'li', '.news-list li', '.article-list li', '.list li',
        '.news', '.article', '.post', '.entry'
      ];
      
      // 尝试不同的文章选择器
      let articles = [];
      for (const selector of articleSelectors) {
        if ($(selector).length > 0) {
          articles = $(selector);
          break;
        }
      }
      
      if (articles.length > 0) {
        // 从文章列表中提取信息
        articles.each((i, article) => {
          if (linkCount >= maxLinks) return false;
          
          // 尝试提取链接和标题
          const link = $(article).find('a').first();
          if (link.length > 0) {
            const href = link.attr('href');
            const linkText = link.text().trim();
            
            if (href && linkText && linkText.length > 3) {
              // 提取发布时间
              let pubDate = '';
              const dateSelectors = ['.date', '.time', '.pubdate', '.publish-time', 'span:contains(年)', 'span:contains(月)', 'span:contains(日)'];
              
              for (const dateSelector of dateSelectors) {
                const dateElement = $(article).find(dateSelector).first();
                if (dateElement.length > 0) {
                  pubDate = dateElement.text().trim();
                  break;
                }
              }
              
              // 处理相对链接
              const absoluteUrl = this.resolveUrl(href, url);
              // 过滤重复链接
              if (!links.some(link => link.url === absoluteUrl)) {
                links.push({
                  title: linkText,
                  url: absoluteUrl,
                  pubDate: pubDate
                });
                linkCount++;
              }
            }
          }
        });
      }
      
      // 如果没有找到文章列表，尝试提取主要内容区域的链接
      if (links.length < 10) {
        const mainContentSelectors = ['main', 'article', '.main-content', '.content', '.article', '.post', '.list', '.news-list', '.article-list'];
        let mainContent = null;
        
        for (const selector of mainContentSelectors) {
          if ($(selector).length > 0) {
            mainContent = $(selector);
            break;
          }
        }
        
        if (mainContent) {
          mainContent.find('a').each((i, el) => {
            if (linkCount >= maxLinks) return false;
            
            const href = $(el).attr('href');
            const linkText = $(el).text().trim();
            if (href && linkText && linkText.length > 3) {
              const absoluteUrl = this.resolveUrl(href, url);
              if (!links.some(link => link.url === absoluteUrl)) {
                links.push({
                  title: linkText,
                  url: absoluteUrl,
                  pubDate: ''
                });
                linkCount++;
              }
            }
          });
        }
      }

      // 如果仍然没有足够的链接，从整个页面提取
      if (links.length < 5) {
        $('a').each((i, el) => {
          if (linkCount >= maxLinks) return false;
          
          const href = $(el).attr('href');
          const linkText = $(el).text().trim();
          if (href && linkText && linkText.length > 3) {
            const absoluteUrl = this.resolveUrl(href, url);
            if (!links.some(link => link.url === absoluteUrl)) {
              links.push({
                title: linkText,
                url: absoluteUrl,
                pubDate: ''
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