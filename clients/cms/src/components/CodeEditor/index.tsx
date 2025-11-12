import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import React, { useEffect, useRef, useState } from 'react';
import './index.module.less';

interface CodeEditorProps {
  value?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
}

export default function CodeEditor({ value, className, style, onChange }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // editor 实例
  const editorRef = useRef<EditorView>();
  // 保存最新的 onChange 回调
  const onChangeRef = useRef(onChange);
  // 编辑器内容
  const [content, setContent] = useState(value);

  // 更新 onChange 引用
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setContent(value || '');
  }, [value]);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.state.doc.toString()) {
      const transaction = editorRef.current.state.update({
        changes: {
          from: 0,
          to: editorRef.current.state.doc.length,
          insert: content || '',
        },
      });
      editorRef.current.dispatch(transaction);
    }
  }, [content]);

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = new EditorView({
      parent: containerRef.current,
      doc: content,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChangeRef.current) {
            const newValue = update.state.doc.toString();
            onChangeRef.current(newValue);
          }
        }),
      ],
    });

    editorRef.current = editor;
    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <div className={`code-editor-container ${className || ''}`} ref={containerRef} style={style} />
  );
}
