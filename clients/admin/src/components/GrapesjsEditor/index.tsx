import React, { useEffect, useRef } from 'react';
import type { Editor as GrapesEditor, EditorConfig } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import styles from './index.module.less';
import { Editor } from './editor';

export interface GrapesjsEditorProps {
  options?: EditorConfig;
  onEditorInit?: (editor: GrapesEditor) => void;
}

const GrapesjsEditor: React.FC<GrapesjsEditorProps> = ({ options, onEditorInit }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<Editor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Prevent double initialization
    if (editorInstance.current) {
      return;
    }

    const editor = new Editor(editorRef.current, options);
    editorInstance.current = editor;

    if (onEditorInit) {
      const gjsEditor = editor.getEditor();
      if (gjsEditor) {
        onEditorInit(gjsEditor);
      }
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  return <div ref={editorRef} className={styles.editorContainer} />;
};

export default GrapesjsEditor;
