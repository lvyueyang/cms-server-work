document.querySelectorAll('.video-player')?.forEach((el) => {
  const video = el.querySelector('video') as HTMLVideoElement;
  const coverEl = el.querySelector('.video-cover') as HTMLDivElement;
  if (!video || !coverEl) {
    return;
  }
  coverEl.addEventListener('click', () => {
    video.play();
    coverEl.classList.add('hidden');
  });
});
