import { Button, Card, Drawer, Empty, Space, Input, DrawerProps, message } from 'antd';
import { ContentLang } from '@cms/server/const';
import { queryTranslations, upsertTranslation } from '@/services/i18n';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import UploadImage from '@/components/UploadImage';
import Editor from '@/components/Editor';
import UploadFile from '../UploadFile';

export type TranslationType = 'text' | 'image' | 'rich' | 'file';

const LangList = [ContentLang.EN_US];

export interface TranslationDrawerProps extends DrawerProps {
  entity: string;
  entityId: number;
  field: string;
  originValue?: string;
  type?: TranslationType;
}

export function TranslationDrawer({
  entity,
  entityId,
  field,
  originValue,
  type = 'text',
  ...props
}: TranslationDrawerProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const { loading, runAsync: fetchData } = useRequest(
    async () => {
      const res = await queryTranslations({ entity, entityId, field });
      const data = res.data?.data;
      const fetchedList = data?.list || [];
      // 将返回的翻译映射到 values 中，按 LangList 进行匹配
      const nextValues: Record<string, string> = {};
      LangList.forEach((lang) => {
        const hit = fetchedList.find((i) => i.lang === lang);
        nextValues[lang] = hit?.value || '';
      });
      setValues(nextValues);
    },
    { manual: true },
  );

  const onChange = (lang: string, val: string) => {
    setValues((prev) => ({ ...prev, [lang]: val }));
  };

  const onSave = async (lang: string) => {
    const value = values[lang] || '';
    setSaving((prev) => ({ ...prev, [lang]: true }));
    try {
      await upsertTranslation({ entity, entityId, field, lang, value });
      message.success('翻译已保存');
      await fetchData();
    } catch (e) {
      // 错误提示由拦截器处理
    } finally {
      setSaving((prev) => ({ ...prev, [lang]: false }));
    }
  };

  const drawerWidth = type === 'rich' ? 1000 : 520;

  useEffect(() => {
    if (props.open) {
      fetchData();
    }
  }, [props.open]);

  return (
    <Drawer {...props} width={drawerWidth} loading={loading} destroyOnHidden>
      <>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          {typeof originValue !== 'undefined' && (
            <Card key="origin" title="原文" size="small">
              {type === 'image' ? (
                originValue ? (
                  <img
                    src={originValue}
                    style={{ maxWidth: '100%', display: 'block', objectFit: 'contain' }}
                  />
                ) : (
                  <Empty description="无原图" />
                )
              ) : type === 'rich' ? (
                <div
                  style={{
                    border: '1px solid #f0f0f0',
                    padding: 8,
                    overflow: 'auto',
                    maxHeight: 400,
                  }}
                  dangerouslySetInnerHTML={{ __html: originValue || '' }}
                />
              ) : (
                <div style={{ whiteSpace: 'pre-wrap' }}>{originValue || ''}</div>
              )}
            </Card>
          )}
          {LangList.map((lang) => {
            const value = values[lang] || '';
            return (
              <Card
                key={lang}
                title={lang}
                size="small"
                extra={
                  <Button
                    size="small"
                    type="primary"
                    loading={!!saving[lang]}
                    onClick={() => onSave(lang)}
                  >
                    保存
                  </Button>
                }
              >
                {type === 'file' ? (
                  <div>
                    {value && <div style={{ marginBottom: 8 }}>{value}</div>}
                    <UploadFile value={value} onChange={(e) => onChange(lang, e)} />
                  </div>
                ) : type === 'image' ? (
                  <UploadImage value={value} onChange={(val) => onChange(lang, val)} />
                ) : type === 'rich' ? (
                  <Editor
                    value={value}
                    onChange={(val) => onChange(lang, val)}
                    style={{ minHeight: 300 }}
                  />
                ) : (
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 10 }}
                    value={value}
                    placeholder="请输入翻译内容"
                    onChange={(e) => onChange(lang, e.target.value)}
                  />
                )}
              </Card>
            );
          })}
          {LangList.length === 0 && <Empty description="暂无语言配置" />}
        </Space>
      </>
    </Drawer>
  );
}
