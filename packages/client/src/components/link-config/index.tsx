import { checkAndGetModels, getConfig, saveApiKey, saveCurrentModel, saveUrl } from '@/api/link';
import type { ModelItem } from '@/types/model';
import { LoadingOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, message, Select } from 'antd';
import type { SelectProps } from 'antd';
import { useEffect, useState } from 'react';

export const LinkConfig = () => {
  const [link, setLink] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [configId, setConfigId] = useState('');
  const [modelLoading, setModelLoading] = useState(false);
  const [models, setModels] = useState<SelectProps['options']>([]);
  const [currentModel, setCurrentModel] = useState('');
  const [saveModelLoading, setSaveModelLoading] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    getConfig().then(res => {
      if (res.success) {
        const data = res.data;
        console.log('[ data ] >', data);
        if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          console.log(firstItem);
          const { id, url, apiKey, currentModel } = firstItem;
          setConfigId(id);
          setLink(url);
          setApiKey(apiKey);
          setCurrentModel(currentModel);
          console.log(url, link);
          handleCheckStatus();
        }
      }
    });
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);

    saveUrl(configId, link);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    console.log('[ configId,apiKey ] >', configId, apiKey);
    saveApiKey(configId, apiKey);
  };

  const handleSelectChange = async (value: string) => {
    console.log('[ value ] >', value);
    setCurrentModel(value);

    setSaveModelLoading(true);
    await saveCurrentModel(configId, currentModel);
    setSaveModelLoading(false);
  };

  // 校验 URL 的连接状态
  const handleCheckStatus = async () => {
    console.log(link);
    if (!link.trim()) {
      message.error('请输入正确的 URL');
      return;
    }
    setModelLoading(true);
    const res = await checkAndGetModels(configId);
    setModelLoading(false);
    if (res.success) {
      const modelsRes = res.data as ModelItem[];
      message.success('连接成功');
      setModels(modelsRes.map((model: ModelItem) => ({ label: model.id, value: model.id })));
    }
  };

  return (
    <div>
      <Form layout="vertical" onFinish={handleCheckStatus}>
        <Form.Item label="基础 URL">
          <Input value={link} onChange={e => setLink(e.target.value)} onBlur={handleUrlChange} />
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
          {saveModelLoading && <LoadingOutlined />}
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
