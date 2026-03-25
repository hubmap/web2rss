import React, { useState } from 'react';

// 主页面组件
export default function Home() {
  const [url, setUrl] = useState('');
  const [feedType, setFeedType] = useState('rss');
  const [customDomain, setCustomDomain] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [error, setError] = useState('');

  // 生成订阅源链接
  const generateFeedUrl = () => {
    if (!url) {
      setError('请输入网页URL');
      return;
    }

    try {
      // 验证URL格式
      new URL(url);
      
      let baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
      if (customDomain) {
        // 确保自定义域名包含协议
        if (!customDomain.startsWith('http://') && !customDomain.startsWith('https://')) {
          baseUrl = `https://${customDomain}`;
        } else {
          baseUrl = customDomain;
        }
      }
      // 确保 baseUrl 末尾没有斜杠
      baseUrl = baseUrl.replace(/\/$/, '');
      const feedUrl = `${baseUrl}/api/${feedType}?url=${encodeURIComponent(url)}`;
      
      setGeneratedUrl(feedUrl);
      setError('');
    } catch (error) {
      setError('无效的URL格式');
      setGeneratedUrl('');
    }
  };

  // 复制链接到剪贴板
  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl)
        .then(() => alert('链接已复制到剪贴板'))
        .catch(err => console.error('复制失败:', err));
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Web2RSS - 网页转RSS订阅工具</h1>
        <p>将任何网页转化为RSS或Atom订阅源</p>
      </header>

      <main>
        <div className="form-container">
          <div className="form-group">
            <label htmlFor="url">网页URL:</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="例如: https://www.example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customDomain">自定义域名 (可选):</label>
            <input
              type="text"
              id="customDomain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="例如: rss.example.com (会自动添加 https://)"
            />
          </div>

          <div className="form-group">
            <label>订阅源格式:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="feedType"
                  value="rss"
                  checked={feedType === 'rss'}
                  onChange={(e) => setFeedType(e.target.value)}
                />
                RSS Feed
              </label>
              <label>
                <input
                  type="radio"
                  name="feedType"
                  value="atom"
                  checked={feedType === 'atom'}
                  onChange={(e) => setFeedType(e.target.value)}
                />
                Atom Feed
              </label>
            </div>
          </div>

          <button onClick={generateFeedUrl} className="generate-btn">
            生成订阅源
          </button>

          {error && <div className="error-message">{error}</div>}

          {generatedUrl && (
            <div className="result-container">
              <h3>生成的订阅源链接:</h3>
              <div className="url-box">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                />
                <button onClick={copyToClipboard} className="copy-btn">
                  复制
                </button>
              </div>
              <p className="instructions">
                将此链接添加到你的RSS阅读器中，即可订阅该网页的更新
              </p>
            </div>
          )}
        </div>

        <div className="features">
          <h3>功能特性</h3>
          <ul>
            <li>✅ 支持任何网页转RSS订阅源</li>
            <li>✅ 支持RSS Feed和Atom Feed两种格式</li>
            <li>✅ 零成本部署到Vercel平台</li>
            <li>✅ 简单易用的界面</li>
            <li>✅ 快速生成订阅源链接</li>
          </ul>
        </div>
      </main>

      <footer>
        <p>Web2RSS - 让任何网页都可以被RSS阅读器订阅</p>
      </footer>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        header h1 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        header p {
          color: #7f8c8d;
        }

        main {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-container {
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
        }

        .form-group input[type="text"] {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .form-group input[type="text"]:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .radio-group {
          display: flex;
          gap: 20px;
        }

        .radio-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: normal;
          cursor: pointer;
        }

        .generate-btn {
          width: 100%;
          padding: 12px;
          background-color: #3498db;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .generate-btn:hover {
          background-color: #2980b9;
        }

        .error-message {
          margin-top: 15px;
          padding: 10px;
          background-color: #fee;
          color: #c00;
          border-radius: 4px;
          font-size: 14px;
        }

        .result-container {
          margin-top: 30px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 4px;
          border-left: 4px solid #3498db;
        }

        .result-container h3 {
          margin-bottom: 10px;
          color: #2c3e50;
        }

        .url-box {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .url-box input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .copy-btn {
          padding: 0 15px;
          background-color: #27ae60;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .copy-btn:hover {
          background-color: #229954;
        }

        .instructions {
          font-size: 14px;
          color: #7f8c8d;
          line-height: 1.5;
        }

        .features {
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .features h3 {
          margin-bottom: 15px;
          color: #2c3e50;
        }

        .features ul {
          list-style: none;
        }

        .features li {
          margin-bottom: 10px;
          padding-left: 25px;
          position: relative;
        }

        .features li:before {
          content: '✅';
          position: absolute;
          left: 0;
        }

        footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          color: #7f8c8d;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }

          .form-container,
          .features {
            padding: 20px;
          }

          .radio-group {
            flex-direction: column;
            gap: 10px;
          }

          .url-box {
            flex-direction: column;
          }

          .copy-btn {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}