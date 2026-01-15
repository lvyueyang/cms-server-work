interface ImagePreviewOptions {
  urls: string[];
  index?: number;
}

// State variables
let currentIndex = 0;
let imageList: string[] = [];

// DOM Elements
let overlay: HTMLElement | null = null;
let container: HTMLElement | null = null;
let imgElement: HTMLImageElement | null = null;
let prevBtn: HTMLElement | null = null;
let nextBtn: HTMLElement | null = null;
let closeBtn: HTMLElement | null = null;
let indicator: HTMLElement | null = null;
let loadingSpinner: HTMLElement | null = null;

/**
 * Initialize the DOM elements for the image previewer
 */
function initPreviewer() {
  if (overlay) return;

  // Create overlay
  overlay = document.createElement('div');
  overlay.className = 'image-preview-overlay';

  // Create close button
  closeBtn = document.createElement('div');
  closeBtn.className = 'image-preview-close';
  overlay.appendChild(closeBtn);

  // Create previous button
  prevBtn = document.createElement('div');
  prevBtn.className = 'image-preview-btn image-preview-prev';
  overlay.appendChild(prevBtn);

  // Create container and image
  container = document.createElement('div');
  container.className = 'image-preview-container';
  imgElement = document.createElement('img');
  container.appendChild(imgElement);
  overlay.appendChild(container);

  // Create loading spinner
  loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'image-preview-loading';
  loadingSpinner.style.display = 'none';
  overlay.appendChild(loadingSpinner);

  // Create next button
  nextBtn = document.createElement('div');
  nextBtn.className = 'image-preview-btn image-preview-next';
  overlay.appendChild(nextBtn);

  // Create indicator
  indicator = document.createElement('div');
  indicator.className = 'image-preview-indicator';
  overlay.appendChild(indicator);

  // Append to body
  document.body.appendChild(overlay);

  // Event Listeners
  closeBtn.addEventListener('click', closePreview);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePreview();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyDown);
}

/**
 * Handle keyboard events
 */
function handleKeyDown(e: KeyboardEvent) {
  if (!overlay || overlay.style.display === 'none') return;

  switch (e.key) {
    case 'Escape':
      closePreview();
      break;
    case 'ArrowLeft':
      showPrev();
      break;
    case 'ArrowRight':
      showNext();
      break;
  }
}

/**
 * Update the UI based on the current state
 */
function updateUI() {
  if (!imgElement || !indicator || !prevBtn || !nextBtn || !container || !loadingSpinner) return;

  // Update buttons state
  if (currentIndex <= 0) {
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.classList.remove('disabled');
  }

  if (currentIndex >= imageList.length - 1) {
    nextBtn.classList.add('disabled');
  } else {
    nextBtn.classList.remove('disabled');
  }

  // Hide buttons if only one image
  if (imageList.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    indicator.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
    indicator.style.display = 'block';
  }

  // Update indicator
  indicator.textContent = `${currentIndex + 1} / ${imageList.length}`;

  // Load image
  const currentSrc = imageList[currentIndex];

  // Reset container loaded state for animation
  container.classList.remove('loaded');
  loadingSpinner.style.display = 'block';
  imgElement.style.opacity = '0.5';

  // Create a new image to preload
  const indexAtStart = currentIndex;
  const tempImg = new Image();
  tempImg.onload = () => {
    if (indexAtStart === currentIndex && imgElement) {
      imgElement.src = currentSrc;
      imgElement.style.opacity = '1';
      container?.classList.add('loaded');
      if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
  };
  tempImg.onerror = () => {
    if (indexAtStart === currentIndex && loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
    // Handle error if needed
  };
  tempImg.src = currentSrc;
}

/**
 * Show previous image
 */
function showPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    updateUI();
  }
}

/**
 * Show next image
 */
function showNext() {
  if (currentIndex < imageList.length - 1) {
    currentIndex++;
    updateUI();
  }
}

/**
 * Close the previewer
 */
function closePreview() {
  if (overlay) {
    overlay.classList.remove('visible');
    setTimeout(() => {
      if (overlay) {
        overlay.style.display = 'none';
        // Clear image src to stop loading/memory
        if (imgElement) imgElement.src = '';
      }
    }, 300); // Match transition duration
  }
}

/**
 * Main function to open the image preview
 */
export function imagePreview(options: ImagePreviewOptions) {
  const { urls, index = 0 } = options;

  if (!urls || urls.length === 0) {
    console.warn('ImagePreview: No URLs provided');
    return;
  }

  initPreviewer();

  imageList = urls;
  currentIndex = Math.max(0, Math.min(index, imageList.length - 1));

  if (overlay) {
    overlay.style.display = 'flex';
    // Force reflow to enable transition
    overlay.offsetHeight;
    overlay.classList.add('visible');
    updateUI();
  }
}

export default imagePreview;
