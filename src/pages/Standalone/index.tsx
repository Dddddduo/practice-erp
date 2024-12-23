import React from 'react';
import { Card } from 'antd';

const StandalonePage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card title="独立页面">
        <p>这是一个不需要鉴权和框架布局的独立页面。</p>
      </Card>
    </div>
  );
};

export default StandalonePage;
