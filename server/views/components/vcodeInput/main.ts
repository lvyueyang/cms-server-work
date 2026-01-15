document.querySelectorAll<HTMLDivElement>('.v-code-input').forEach((container) => {
  const btn = container.querySelector<HTMLButtonElement>('.code-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    // 1. Get Phone Number
    const form = btn.closest('form');
    if (!form) {
      console.warn('VCodeInput must be used inside a form');
      return;
    }
    const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]');
    if (!phoneInput) {
      alert('无法找到手机号输入框');
      return;
    }
    const phone = phoneInput.value.trim();
    if (!phone) {
      phoneInput.focus();
      alert('请输入手机号');
      return;
    }

    // 2. Get Image Code
    // ImgCodeInput is expected to be the next sibling of .v-code-input
    const imgCodeContainer = container.nextElementSibling as HTMLElement;
    if (!imgCodeContainer || !imgCodeContainer.classList.contains('img-code-input')) {
      console.warn('ImgCodeInput component not found');
      return;
    }

    const imgCodeInput = imgCodeContainer.querySelector<HTMLInputElement>('input.input');
    const imgCodeHashInput = imgCodeContainer.querySelector<HTMLInputElement>('.image_code_hash');

    if (!imgCodeInput || !imgCodeHashInput) {
      console.warn('ImgCodeInput inputs not found');
      return;
    }

    const imageCode = imgCodeInput.value.trim();
    if (!imageCode) {
      imgCodeInput.focus();
      alert('请输入图形验证码');
      return;
    }

    // 3. Send Request
    const type = container.dataset.type || 'user_client_phone_login';
    const originalText = btn.innerText;

    btn.disabled = true;
    btn.innerText = '发送中...';

    try {
      const response = await fetch('/api/validate-code/send/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          image_code: imageCode,
          image_code_hash: imgCodeHashInput.value,
          type,
        }),
      });

      const res = await response.json();

      if (res.statusCode === 200) {
        startCountdown(btn, originalText);
      } else {
        alert(res.message || '发送失败');
        // Refresh captcha
        const imgEle = imgCodeContainer.querySelector<HTMLElement>('.code-img');
        if (imgEle) imgEle.click();

        btn.disabled = false;
        btn.innerText = originalText;
      }
    } catch (error) {
      console.error(error);
      alert('网络错误，请稍后重试');
      btn.disabled = false;
      btn.innerText = originalText;
    }
  });
});

function startCountdown(btn: HTMLButtonElement, originalText: string) {
  let time = 60;
  btn.innerText = `${time}s`;
  const timer = setInterval(() => {
    time--;
    if (time <= 0) {
      clearInterval(timer);
      btn.disabled = false;
      btn.innerText = originalText;
    } else {
      btn.innerText = `${time}s`;
    }
  }, 1000);
}
