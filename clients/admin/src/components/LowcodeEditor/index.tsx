import { Modal } from 'antd';
import { Editor } from 'grapesjs';
import React, { useRef, useState } from 'react';
import GrapesjsEditor from '../GrapesjsEditor';
import styles from './index.module.less';

interface LowCodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const LowCodeEditor: React.FC<LowCodeEditorProps> = ({ value, onChange, placeholder = '点击编辑内容' }) => {
  const [open, setOpen] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  const handleOk = () => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const html = editor
        .getComponents()
        .models.map((m) => m.toHTML())
        .join('');
      const cssJson = editor.getCss({ json: true }) as any;
      const css = cssJson.map((c: any) => c.toCSS()).join('');
      const content = `<style>${css}</style>${html}`;
      onChange?.(content);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className={styles.previewContainer}
        onClick={() => setOpen(true)}
      >
        {value ? (
          <div
            dangerouslySetInnerHTML={{ __html: value }}
            style={{ pointerEvents: 'none' }}
          />
        ) : (
          <div className={styles.placeholder}>{placeholder}</div>
        )}
      </div>

      <Modal
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width="100%"
        styles={{
          wrapper: {
            maxWidth: '100%',
          },
          container: {
            padding: 0,
            height: '100vh',
          },
          body: {
            padding: 0,
            height: 'calc(100vh - 44px)',
            width: '100vw',
            overflow: 'hidden',
          },
          footer: {
            margin: 0,
            alignItems: 'center',
            height: 44,
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: 10,
          },
        }}
        style={{ maxWidth: '100%' }}
        maskClosable={false}
        destroyOnHidden
        centered
        keyboard={false}
        closeIcon={false}
      >
        <div className={styles.editorContainer}>
          <GrapesjsEditor
            onEditorInit={(editor) => {
              editorRef.current = editor;
            }}
            options={{
              pageManager: {
                pages: [
                  {
                    id: 'Home',
                    name: 'Home',
                    component: value || '',
                  },
                ],
              },
            }}
          />
          {/* <StudioEditor
            onReady={(editor) => {
              editorRef.current = editor;
              // setTimeout(() => {
              //   editor.setDevice('Tablet');
              // }, 500);
              // console.log(editor.I18n.getLocale());
              // editor.I18n.setLocale('');
            }}
            options={{
              gjsOptions: {
                optsHtml: {
                  keepInlineStyle: true,
                },
              },
              i18n: {
                locales: {
                  zh: zh,
                },
              },
              licenseKey: '',
              storage: {
                type: 'self',
                project: {
                  pages: [{ name: 'Home', component: value }],
                },
                onSave: async ({ project }) => console.log('Save project', { project }),
              },
              project: {
                type: 'document',
                default: {
                  pages: [
                    {
                      name: 'Home',
                      component: value || '',
                    },
                  ],
                },
              },
              pages: false,
              assets: {
                storageType: 'self',
                onUpload: async (props) => {
                  const { files } = props;
                  const result = await Promise.all(
                    Array.from(files).map((file) => {
                      return uploadFile(file).then((res) => {
                        const data = res.data.data;
                        return {
                          id: data.id,
                          src: `/getfile/${data.id}`,
                          name: data.name,
                          mineType: data.type,
                          size: data.size,
                        };
                      });
                    }),
                  );
                  return result;
                },
                onLoad: async () => {
                  const files = await getFileListApi({
                    current: 1,
                    page_size: 100,
                  }).then((r) => r.data.data.list);
                  return files.map((f) => {
                    return {
                      name: f.name,
                      type: f.type.split('/')[0],
                      src: `/getfile/${f.id}`,
                    };
                  });
                },
              },
              plugins: [
                layoutSidebarButtons,
                // https://app.grapesjs.com/docs-sdk/plugins/components/table
                // tableComponent.init({
                //   block: { category: 'Basic', label: '表格' },
                // }),
                rteTinyMce.init({
                  enableOnClick: true,
                  // Custom TinyMCE configuration
                  loadConfig: ({ component, config }) => {
                    const demoRte = component.get('demorte');
                    if (demoRte === 'fixed') {
                      return {
                        toolbar:
                          'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | link image media',
                        fixed_toolbar_container_target: document.querySelector('.rteContainer'),
                      };
                    } else if (demoRte === 'quickbar') {
                      return {
                        plugins: `${config.plugins} quickbars`,
                        toolbar: false,
                        quickbars_selection_toolbar:
                          'bold italic underline strikethrough | quicklink image',
                      };
                    }
                    return {};
                  },
                }),
              ],
            }}
          /> */}
        </div>
      </Modal>
    </>
  );
};
