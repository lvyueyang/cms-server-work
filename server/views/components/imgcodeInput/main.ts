document.querySelectorAll('.img-code-input').forEach((item) => {
  const imgEle = item.querySelector('.code-img');
  if (!imgEle) return;
  const loadImg = () => {
    fetch('/api/image-validate-code')
      .then((res) => res.json())
      .then((data) => {
        imgEle.innerHTML = data.data;
        const imgCodeHashEl = item.querySelector<HTMLInputElement>('.image_code_hash');
        if (imgCodeHashEl) {
          imgCodeHashEl.value = data.hash;
        }
      });
  };
  loadImg();
  imgEle.addEventListener('click', loadImg);
});
