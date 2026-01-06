import { checkAndGetModels, saveApiKey } from '@/api/link';
import { ModelItem } from '@/types/model';
import { CommonResponse } from '@/types/request';
import { Button, Form, Input, message, Select, SelectProps } from 'antd';
import { useState } from 'react';

export const LinkConfig = () => {
  const [link, setLink] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [configId, setConfigId] = useState('');
  const [modelLoading, setModelLoading] = useState(false);
  const [models, setModels] = useState<SelectProps['options']>([]);
  const [currentModel, setCurrentModel] = useState('');
  const [messageApi] = message.useMessage();

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    console.log('[ configId,apiKey ] >', configId, apiKey);
    saveApiKey(configId, apiKey);
  };

  const handleSelectChange = (value: string) => {
    console.log('[ value ] >', value);
    setConfigId(value);
  };

  // 校验 URL 的连接状态
  const handleCheckStatus = async () => {
    if (!link.trim()) {
      messageApi.error('请输入正确的');
      return;
    }
    setModelLoading(true);
    const res = await checkAndGetModels(link);
    setModelLoading(false);
    if (res.success) {
      const modelsRes = res.data as ModelItem[];
      messageApi.success('连接成功');
      setModels(modelsRes.map((model: ModelItem) => ({ label: model.id, value: model.id })));
      console.log('[ models ] >', models);
    }
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
          <Select style={{ width: 120 }} onChange={handleSelectChange} options={models} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" loading={modelLoading}>
            连 接
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
