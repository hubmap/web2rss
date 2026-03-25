import RssGenerator from '../../lib/rssGenerator.js';

// RSS Feed API接口
export default async function handler(req, res) {
  try {
    // 获取URL参数
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // 生成RSS Feed
    const rssFeed = await RssGenerator.generate(url);

    // 设置响应头
    res.setHeader('Content-Type', 'application/rss+xml');
    res.status(200).send(rssFeed);
  } catch (error) {
    console.error('Error in RSS API:', error);
    res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
}