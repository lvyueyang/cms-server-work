import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import GrapesjsEditor from '@/components/GrapesjsEditor';

export default function GrapesjsDemo() {
  return (
    <PageContainer title="GrapesJS Demo">
      <div style={{ height: '80vh', border: '1px solid #d9d9d9' }}>
        <GrapesjsEditor
          options={{
            height: '100%',
            storageManager: false,
          }}
        />
      </div>
    </PageContainer>
  );
}
