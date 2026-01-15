import grapesjs, { Editor as GrapesEditor, EditorConfig } from 'grapesjs';
import basicBlocks from 'grapesjs-blocks-basic';
import customCode from 'grapesjs-custom-code';
import assetManager from '../plugins/assetManager';
import clearCanvasPlugin from '../plugins/clearCanvas';
import exportDataPlugin from '../plugins/exportData';

export class Editor {
  private editor: GrapesEditor | null = null;

  constructor(
    public container: HTMLElement,
    private config?: EditorConfig,
  ) {
    this.init();
  }

  init() {
    if (this.editor) return;

    const defaultConfig: EditorConfig = {
      container: this.container,
      height: '100%',
      storageManager: false,
      assetManager: {
        custom: true,
      },
      ...this.config,
      plugins: [
        (editor) => basicBlocks(editor, {}),
        (editor) =>
          customCode(editor, {
            modalTitle: '自定义代码',
          }),
        (editor) => assetManager(editor),
        (editor) => exportDataPlugin(editor),
        (editor) => clearCanvasPlugin(editor),
        ...(this.config?.plugins || []),
      ],
    };

    this.editor = grapesjs.init(defaultConfig);
  }

  getEditor(): GrapesEditor | null {
    return this.editor;
  }

  destroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }
}
