import AtomGenerator from '../../lib/atomGenerator.js';

// Atom Feed API接口
export default async function handler(req, res) {
  try {
    // 获取URL参数
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log('Generating Atom feed for URL:', url);

    // 生成Atom Feed
    const atomFeed = await AtomGenerator.generate(url);

    // 设置响应头
    res.setHeader('Content-Type', 'application/atom+xml');
    res.status(200).send(atomFeed);
  } catch (error) {
    console.error('Error in Atom API:', error.message, error.stack);
    res.status(500).json({ error: `Failed to generate Atom feed: ${error.message}` });
  }
}