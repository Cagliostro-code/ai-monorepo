import { getStatus } from '@/api/chat-completions';
import { Button, Input } from 'antd';
import { useState } from 'react';

export const LinkConfig = () => {
  const [link, setLink] = useState('');
  const handleCheckStatus = () => {
    getStatus(link);
  };

  return (
    <div>
      Link Config
      <Input value={link} onChange={e => setLink(e.target.value)} />
      <Button onClick={handleCheckStatus}>confirm</Button>
    </div>
  );
};
