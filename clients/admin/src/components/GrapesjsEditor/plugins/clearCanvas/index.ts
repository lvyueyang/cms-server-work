import { Editor } from 'grapesjs';

// 清空画布的按钮
export default function clearCanvasPlugin(editor: Editor) {
  editor.Panels.addButton('options', {
    id: 'canvas-clear',
    className: 'fa fa-trash',
    command: (editor: Editor) => {
      if (confirm('确定要清空画布吗？')) {
        editor.runCommand('core:canvas-clear');
      }
    },
    attributes: { title: '清空画布' },
  });
}
