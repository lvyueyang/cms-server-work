import { Editor } from 'grapesjs';

export default function exportDataPlugin(editor: Editor) {
  // Export JSON
  editor.Commands.add('export-json', {
    run(editor) {
      const modal = editor.Modal;
      modal.setTitle('导出 JSON');

      const projectData = editor.getProjectData();
      const code = JSON.stringify(projectData, null, 2);

      const content = `
        <div class="gjs-export-container">
          <textarea class="gjs-export-textarea" readonly style="width: 100%; height: 400px; padding: 10px; border: 1px solid #ddd; font-family: monospace;background: transparent;">${code}</textarea>
        </div>
      `;

      modal.setContent(content);
      modal.open();
    },
  });

  // Import JSON
  editor.Commands.add('import-json', {
    run(editor) {
      const modal = editor.Modal;
      modal.setTitle('导入 JSON');

      const content = `
        <div class="gjs-import-container" style="display: flex; flex-direction: column; gap: 10px;">
          <textarea id="gjs-import-textarea" placeholder="在此粘贴 JSON 配置..." style="width: 100%; height: 400px; padding: 10px;"></textarea>
          <button id="gjs-import-json-btn" class="gjs-btn-prim" style="padding: 10px; cursor: pointer; background-color: #463a3c; color: white; border: none; border-radius: 3px;">
            导入
          </button>
        </div>
      `;

      modal.setContent(content);
      modal.open();

      const btn = document.getElementById('gjs-import-json-btn');
      const textarea = document.getElementById('gjs-import-json-textarea') as HTMLTextAreaElement;

      if (btn && textarea) {
        btn.onclick = () => {
          const code = textarea.value.trim();
          if (!code) return;

          try {
            const data = JSON.parse(code);
            editor.loadProjectData(data);
            modal.close();
          } catch (e) {
            console.error(e);
            alert('JSON 格式错误，请检查后重试');
          }
        };
      }
    },
  });

  // Import HTML & CSS
  editor.Commands.add('import-code', {
    run(editor) {
      const modal = editor.Modal;
      modal.setTitle('导入 HTML & CSS');

      const content = `
        <div class="gjs-import-container" style="display: flex; flex-direction: column; gap: 15px;">
          <div>
            <h4 style="margin: 0 0 10px;">HTML</h4>
            <textarea id="gjs-import-html-textarea" placeholder="在此粘贴 HTML..." style="width: 100%; height: 150px; padding: 10px; "></textarea>
          </div>
          <div>
            <h4 style="margin: 0 0 10px;">CSS</h4>
            <textarea id="gjs-import-css-textarea" placeholder="在此粘贴 CSS..." style="width: 100%; height: 150px; padding: 10px; "></textarea>
          </div>
          <button id="gjs-import-code-btn" class="gjs-btn-prim" style="padding: 10px; cursor: pointer; background-color: #463a3c; color: white; border: none; border-radius: 3px;">
            导入
          </button>
        </div>
      `;

      modal.setContent(content);
      modal.open();

      const btn = document.getElementById('gjs-import-code-btn');
      const htmlTextarea = document.getElementById(
        'gjs-import-html-textarea',
      ) as HTMLTextAreaElement;
      const cssTextarea = document.getElementById('gjs-import-css-textarea') as HTMLTextAreaElement;

      if (btn && htmlTextarea && cssTextarea) {
        btn.onclick = () => {
          const html = htmlTextarea.value.trim();
          const css = cssTextarea.value.trim();

          if (!html && !css) return;

          try {
            if (html) editor.setComponents(html);
            if (css) editor.setStyle(css);
            modal.close();
          } catch (e) {
            console.error(e);
            alert('导入失败，请检查代码格式');
          }
        };
      }
    },
  });

  // Add Buttons to Panel
  editor.Panels.addButton('options', [
    {
      id: 'export-json',
      className: 'fa fa-file-code-o',
      command: 'export-json',
      attributes: { title: '导出 JSON' },
    },
    {
      id: 'import-json',
      className: 'fa fa-upload',
      command: 'import-json',
      attributes: { title: '导入 JSON' },
    },
    {
      id: 'import-code',
      className: 'fa fa-cloud-upload',
      command: 'import-code',
      attributes: { title: '导入 HTML & CSS' },
    },
  ]);
}
