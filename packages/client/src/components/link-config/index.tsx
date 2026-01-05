import { checkAndGetModels, saveApiKey } from '@/api/link';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';

export const LinkConfig = () => {
  const [link, setLink] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [configId, setConfigId] = useState('');
  const [messageApi] = message.useMessage();

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    console.log('[ configId,apiKey ] >', configId, apiKey);
    saveApiKey(configId, apiKey);
  };

  // 校验 URL 的连接状态
  const handleCheckStatus = () => {
    if (!link.trim()) {
      messageApi.error('请输入正确的');
      return;
    }
    checkAndGetModels(link);
  };

  return (
    <div>
      <Form layout="vertical" onFinish={handleCheckStatus}>
        <Form.Item label="基础 URL">
          <Input value={link} onChange={e => setLink(e.target.value)} />
          <span>不行？在 URL 末尾添加 /v1 试试！</span>
        </Form.Item>
        <Form.Item label="秘钥">
          <Input
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            onBlur={handleApiKeyChange}
          />
          <span>不行？在 URL 末尾添加 /v1 试试！</span>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">连 接</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
