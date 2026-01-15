import { ContentLang } from '@cms/server/const';
import { useRequest } from 'ahooks';
import { Button, Card, Drawer, DrawerProps, Empty, message, Space } from 'antd';
import { useEffect, useState } from 'react';
import { ContentType } from '@/constants';
import { queryTranslations, upsertTranslation } from '@/services/i18n';
import { AutoContentInput } from '../AutoContentInput';

const LangList = [ContentLang.EN_US];

export interface TranslationDrawerProps extends DrawerProps {
  entity: string;
  entityId: number | string;
  field: string;
  originValue?: string;
  type?: ContentType;
}

export function TranslationDrawer({
  entity,
  entityId,
  field,
  originValue,
  type = ContentType.TEXT,
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
    { manual: true }
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

  const drawerWidth = [ContentType.TEXT, ContentType.FILE, ContentType.IMAGE, ContentType.INPUT].includes(type)
    ? 520
    : 1000;

  useEffect(() => {
    if (props.open) {
      fetchData();
    }
  }, [props.open]);

  return (
    <Drawer
      {...props}
      width={drawerWidth}
      loading={loading}
      destroyOnHidden
    >
      <Space
        orientation="vertical"
        style={{ width: '100%' }}
        size={12}
      >
        {typeof originValue !== 'undefined' && (
          <Card
            key="origin"
            title="原文"
            size="small"
          >
            {type === ContentType.IMAGE ? (
              originValue ? (
                <img
                  src={originValue}
                  style={{
                    maxWidth: '100%',
                    display: 'block',
                    objectFit: 'contain',
                  }}
                  alt=""
                />
              ) : (
                <Empty description="无原图" />
              )
            ) : (
              <div
                style={{
                  border: '1px solid #f0f0f0',
                  padding: 8,
                  overflow: 'auto',
                  maxHeight: 400,
                  whiteSpace: 'pre-wrap',
                }}
                dangerouslySetInnerHTML={{ __html: originValue || '' }}
              />
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
              <AutoContentInput
                type={type}
                value={value}
                onChange={(val) => onChange(lang, val)}
              />
              {/* {type === 'file' && (
                  <div>
                    {value && <div style={{ marginBottom: 8 }}>{value}</div>}
                    <UploadFile value={value} onChange={(e) => onChange(lang, e)} />
                  </div>
                )}
                {type === 'image' && (
                  <UploadImage value={value} onChange={(val) => onChange(lang, val)} />
                )}
                {type === 'rich' && (
                  <Editor
                    value={value}
                    onChange={(val) => onChange(lang, val)}
                    style={{ minHeight: 300 }}
                  />
                )}
                {type === 'text' && (
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 10 }}
                    value={value}
                    placeholder="请输入翻译内容"
                    onChange={(e) => onChange(lang, e.target.value)}
                  />
                )}
                {['code', 'json'].includes(type) && (
                  <CodeEditor value={value} onChange={(e) => onChange(lang, e)} />
                )} */}
            </Card>
          );
        })}
        {LangList.length === 0 && <Empty description="暂无语言配置" />}
      </Space>
    </Drawer>
  );
}
