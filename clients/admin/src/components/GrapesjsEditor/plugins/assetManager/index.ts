import { FileManageInfo } from '@cms/api-interface';
import { Editor } from 'grapesjs';
import { getListApi } from '@/pages/file-manage/module/services';
import { uploadFile } from '@/services';
import { fileToUrl } from '@/utils';

// Simple CSS for the modal
const CSS_STYLES = `
.gjs-am-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.gjs-am-modal-content {
  background-color: #fff;
  width: 900px;
  max-width: 95%;
  height: 600px;
  max-height: 90%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.gjs-am-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gjs-am-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.gjs-am-close {
  cursor: pointer;
  font-size: 20px;
  color: #999;
  background: none;
  border: none;
  padding: 0;
}

.gjs-am-close:hover {
  color: #666;
}

.gjs-am-toolbar {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.gjs-am-search {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  width: 300px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.gjs-am-search:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.gjs-am-upload-btn {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 6px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.gjs-am-upload-btn:hover {
  background-color: #40a9ff;
}

.gjs-am-upload-btn:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}

.gjs-am-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  position: relative;
}

.gjs-am-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  font-size: 14px;
  color: #1890ff;
}

.gjs-am-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 14px;
}

.gjs-am-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.gjs-am-item {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  position: relative;
}

.gjs-am-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #e6f7ff;
}

.gjs-am-item.selected {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.gjs-am-item-preview {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  overflow: hidden;
}

.gjs-am-item-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.gjs-am-item-name {
  padding: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gjs-am-footer {
  padding: 12px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gjs-am-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gjs-am-page-btn {
  border: 1px solid #d9d9d9;
  background: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.gjs-am-page-btn:disabled {
  color: #ccc;
  background: #f5f5f5;
  cursor: not-allowed;
}

.gjs-am-page-info {
  font-size: 12px;
  color: #666;
}

.gjs-am-confirm-btn {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 6px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.gjs-am-confirm-btn:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}
`;

class AssetManagerUI {
  private container: HTMLElement;
  private overlay: HTMLElement;
  private currentList: FileManageInfo[] = [];
  private selectedFile: FileManageInfo | null = null;
  private currentPage: number = 1;
  private pageSize: number = 20;
  private total: number = 0;
  private keyword: string = '';
  private loading: boolean = false;
  private editor: Editor;
  private onSelect?: (files: any[]) => void;
  private onClose: () => void;

  constructor(editor: Editor, options: any, onClose: () => void) {
    this.editor = editor;
    this.onSelect = options.onSelect;
    this.onClose = onClose;

    this.container = document.createElement('div');
    this.overlay = document.createElement('div');
    this.init();
  }

  private init() {
    // Inject Styles
    if (!document.getElementById('gjs-am-styles')) {
      const style = document.createElement('style');
      style.id = 'gjs-am-styles';
      style.innerHTML = CSS_STYLES;
      document.head.appendChild(style);
    }

    this.overlay.className = 'gjs-am-modal-overlay';

    const content = `
      <div class="gjs-am-modal-content">
        <div class="gjs-am-header">
          <h3 class="gjs-am-title">选择资源</h3>
          <button class="gjs-am-close" id="gjs-am-close-btn">×</button>
        </div>
        <div class="gjs-am-toolbar">
          <input type="text" class="gjs-am-search" placeholder="搜索文件名称..." id="gjs-am-search-input">
          <div>
            <input type="file" id="gjs-am-upload-input" style="display: none">
            <button class="gjs-am-upload-btn" id="gjs-am-upload-btn">
              <span>上传文件</span>
            </button>
          </div>
        </div>
        <div class="gjs-am-body" id="gjs-am-body">
          <div class="gjs-am-grid" id="gjs-am-grid"></div>
          <div class="gjs-am-loading" id="gjs-am-loading" style="display: none;">加载中...</div>
        </div>
        <div class="gjs-am-footer">
          <div class="gjs-am-pagination">
            <button class="gjs-am-page-btn" id="gjs-am-prev-btn">上一页</button>
            <span class="gjs-am-page-info" id="gjs-am-page-info">1 / 1</span>
            <button class="gjs-am-page-btn" id="gjs-am-next-btn">下一页</button>
          </div>
          <button class="gjs-am-confirm-btn" id="gjs-am-confirm-btn" disabled>确定</button>
        </div>
      </div>
    `;

    this.overlay.innerHTML = content;
    document.body.appendChild(this.overlay);

    this.bindEvents();
    this.fetchData();
  }

  private bindEvents() {
    // Close
    this.overlay.querySelector('#gjs-am-close-btn')?.addEventListener('click', () => this.destroy());

    // Search
    const searchInput = this.overlay.querySelector('#gjs-am-search-input') as HTMLInputElement;
    let timeout: any;
    searchInput?.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.keyword = (e.target as HTMLInputElement).value;
        this.currentPage = 1;
        this.fetchData();
      }, 500);
    });

    // Upload
    const uploadBtn = this.overlay.querySelector('#gjs-am-upload-btn');
    const uploadInput = this.overlay.querySelector('#gjs-am-upload-input') as HTMLInputElement;

    uploadBtn?.addEventListener('click', () => {
      uploadInput.click();
    });

    uploadInput?.addEventListener('change', async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        await this.handleUpload(files[0]);
        uploadInput.value = ''; // Reset
      }
    });

    // Pagination
    this.overlay.querySelector('#gjs-am-prev-btn')?.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchData();
      }
    });

    this.overlay.querySelector('#gjs-am-next-btn')?.addEventListener('click', () => {
      const maxPage = Math.ceil(this.total / this.pageSize);
      if (this.currentPage < maxPage) {
        this.currentPage++;
        this.fetchData();
      }
    });

    // Confirm
    this.overlay.querySelector('#gjs-am-confirm-btn')?.addEventListener('click', () => {
      this.confirmSelection();
    });
  }

  private async handleUpload(file: File) {
    this.setLoading(true);
    try {
      const res = await uploadFile(file);
      // const data = res.data.data;
      // Refresh list
      this.currentPage = 1;
      await this.fetchData();
    } catch (error) {
      console.error('Upload failed', error);
      alert('上传失败');
    } finally {
      this.setLoading(false);
    }
  }

  private async fetchData() {
    this.setLoading(true);
    try {
      const res = await getListApi({
        current: this.currentPage,
        page_size: this.pageSize,
        keyword: this.keyword,
      });
      this.currentList = res.data.data.list;
      this.total = res.data.data.total;
      this.renderGrid();
      this.updatePagination();
    } catch (error) {
      console.error('Fetch list failed', error);
    } finally {
      this.setLoading(false);
    }
  }

  private setLoading(loading: boolean) {
    this.loading = loading;
    const loader = this.overlay.querySelector('#gjs-am-loading') as HTMLElement;
    if (loader) {
      loader.style.display = loading ? 'flex' : 'none';
    }
  }

  private renderGrid() {
    const grid = this.overlay.querySelector('#gjs-am-grid') as HTMLElement;
    if (!grid) return;

    grid.innerHTML = '';

    if (this.currentList.length === 0) {
      grid.innerHTML = '<div class="gjs-am-empty" style="grid-column: 1/-1;">暂无资源</div>';
      return;
    }

    this.currentList.forEach((file) => {
      const item = document.createElement('div');
      item.className = 'gjs-am-item';
      if (this.selectedFile?.id === file.id) {
        item.classList.add('selected');
      }

      const isImage = file.type?.startsWith('image');
      const preview = isImage
        ? `<img src="${fileToUrl(file.id)}" alt="${file.name}" />`
        : `<span style="font-size: 24px; color: #999;">📄</span>`;

      item.innerHTML = `
        <div class="gjs-am-item-preview">${preview}</div>
        <div class="gjs-am-item-name" title="${file.name}">${file.name}</div>
      `;

      item.addEventListener('click', () => {
        this.selectItem(file);
      });

      // Double click to confirm
      item.addEventListener('dblclick', () => {
        this.selectItem(file);
        this.confirmSelection();
      });

      grid.appendChild(item);
    });
  }

  private selectItem(file: FileManageInfo) {
    this.selectedFile = file;

    // Update UI
    const items = this.overlay.querySelectorAll('.gjs-am-item');
    items.forEach((el) => {
      el.classList.remove('selected');
    });

    // Find the one we just clicked (simple matching by checking list index or re-rendering)
    // Re-rendering is easier for state consistency but slightly heavier.
    // Let's just re-render grid for simplicity or toggle class.
    this.renderGrid();

    // Enable confirm button
    const btn = this.overlay.querySelector('#gjs-am-confirm-btn') as HTMLButtonElement;
    if (btn) btn.disabled = false;
  }

  private updatePagination() {
    const info = this.overlay.querySelector('#gjs-am-page-info');
    const prevBtn = this.overlay.querySelector('#gjs-am-prev-btn') as HTMLButtonElement;
    const nextBtn = this.overlay.querySelector('#gjs-am-next-btn') as HTMLButtonElement;

    const maxPage = Math.ceil(this.total / this.pageSize) || 1;

    if (info) info.textContent = `${this.currentPage} / ${maxPage}`;
    if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = this.currentPage >= maxPage;
  }

  private confirmSelection() {
    if (!this.selectedFile) return;

    const file = this.selectedFile;
    const assets = [
      {
        src: fileToUrl(file.id),
        name: file.name,
        type: file.type?.startsWith('image') ? 'image' : 'file',
        height: 100,
        width: 100,
      },
    ];

    this.editor.AssetManager.add(assets);

    if (this.onSelect) {
      this.onSelect(assets);
    } else {
      const selected = this.editor.getSelected();
      if (selected && selected.is('image')) {
        selected.set('src', assets[0].src);
      }
    }

    this.destroy();
  }

  public destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.onClose();
  }
}

export default function assetManagerPlugin(editor: Editor) {
  editor.Commands.add('open-assets', {
    run(editor, sender, options = {}) {
      // Create and open the UI
      new AssetManagerUI(editor, options, () => {
        editor.stopCommand('open-assets');
      });
    },
    stop(editor) {
      // The UI handles its own destruction usually,
      // but we can ensure it's closed if called programmatically
      const overlay = document.querySelector('.gjs-am-modal-overlay');
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    },
  });
}
