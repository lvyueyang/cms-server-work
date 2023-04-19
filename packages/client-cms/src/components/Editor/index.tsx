import { uploadFile } from '@/services';
import { cls } from '@/utils';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor as WangEditor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import React, { useEffect, useState } from 'react';
import './index.module.less';

interface InsertImageFn {
  (url: string, alt: string, href: string): void;
}

interface InsertVideoFn {
  (url: string, poster?: string): void;
}
interface EditorProps {
  placeholder?: string;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
  minHeight?: number;
  onChange?: (value: string) => void;
}

export default function Editor({ value, placeholder, className, style, onChange }: EditorProps) {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // 编辑器内容
  const [html, setHtml] = useState('');

  useEffect(() => {
    setHtml(value || '');
  }, [value]);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    MENU_CONF: {
      uploadImage: {
        customUpload(file: File, insertFn: InsertImageFn) {
          uploadFile(file).then((res) => {
            const url = res.data.data;
            insertFn(url, file.name, url);
          });
        },
      },
      uploadVideo: {
        customUpload(file: File, insertFn: InsertVideoFn) {
          uploadFile(file).then((res) => {
            const url = res.data.data;
            insertFn(url);
          });
        },
      },
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div className="wang-editor-container">
        <Toolbar editor={editor} defaultConfig={toolbarConfig} className="wang-editor-toolbar" />
        <WangEditor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => {
            let value = editor.getHtml();
            if (value === '<p><br></p>') {
              value = '';
            }
            onChange?.(value);
          }}
          style={style}
          className={cls(className)}
        />
      </div>
    </>
  );
}
