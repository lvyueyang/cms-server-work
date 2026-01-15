import { uploadFile } from '@/services';
import { cls, fileToUrl } from '@/utils';
import { Boot, IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Toolbar, Editor as WangEditor } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import attachmentModule from '@wangeditor/plugin-upload-attachment';
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

Boot.registerModule(attachmentModule);

export default function Editor({ value, placeholder, className, style, onChange }: EditorProps) {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // 编辑器内容
  const [html, setHtml] = useState('');

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    insertKeys: {
      index: 24,
      keys: ['uploadAttachment'], // “上传附件”菜单
    },
  }; // TS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    hoverbarKeys: {
      attachment: {
        menuKeys: ['downloadAttachment'], // “下载附件”菜单
      },
    },
    MENU_CONF: {
      uploadImage: {
        customUpload(file: File, insertFn: InsertImageFn) {
          uploadFile(file).then((res) => {
            const url = fileToUrl(res.data.data);
            insertFn(url, file.name, url);
          });
        },
      },
      uploadVideo: {
        customUpload(file: File, insertFn: InsertVideoFn) {
          uploadFile(file).then((res) => {
            const url = fileToUrl(res.data.data);
            insertFn(url);
          });
        },
      },
      uploadAttachment: {
        customUpload(file: File, insertFn: InsertVideoFn) {
          uploadFile(file).then((res) => {
            const url = fileToUrl(res.data.data);
            insertFn(file.name, url);
          });
        },
      },
    },
  };

  useEffect(() => {
    if (html !== value) {
      setHtml(value || '');
    }
  }, [value]);
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
            let htmlValue = editor.getHtml();
            if (htmlValue === '<p><br></p>') {
              htmlValue = '';
            }
            if (html === htmlValue) return;
            onChange?.(htmlValue);
          }}
          style={{
            ...style,
          }}
          className={cls(className)}
        />
      </div>
    </>
  );
}
