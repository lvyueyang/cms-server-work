document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  // initForms();
  // initSendSms();
});

function initTabs() {
  const tabs = document.querySelectorAll('.login-tabs .tab');
  const forms = document.querySelectorAll('.login-form');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach((t) => {
        t.classList.remove('active');
      });
      // Add active class to clicked tab
      tab.classList.add('active');

      const type = tab.getAttribute('data-type');

      // Hide all forms
      forms.forEach((form) => {
        form.classList.remove('active');
      });
      // Show corresponding form
      const targetForm = document.getElementById(`form-${type}`);
      if (targetForm) {
        targetForm.classList.add('active');
      }
    });
  });
}

function initForms() {
  // Password Login
  const passwordForm = document.getElementById('form-password') as HTMLFormElement;
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(passwordForm);
      const data = Object.fromEntries(formData.entries());

      if (!data.phone || !data.password) {
        alert('请输入手机号和密码');
        return;
      }

      try {
        const res = await fetch('/login/password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.code === 200) {
          window.location.href = '/';
        } else {
          alert(result.message || '登录失败');
        }
      } catch (err) {
        console.error(err);
        alert('登录失败，请稍后重试');
      }
    });
  }

  // SMS Login
  const smsForm = document.getElementById('form-sms') as HTMLFormElement;
  if (smsForm) {
    smsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(smsForm);
      const data = Object.fromEntries(formData.entries());

      if (!data.phone || !data.code) {
        alert('请输入手机号和验证码');
        return;
      }

      try {
        const res = await fetch('/login/code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: data.phone,
            code: data.code,
          }),
        });
        const result = await res.json();
        if (res.ok && result.code === 200) {
          window.location.href = '/';
        } else {
          alert(result.message || '登录失败');
        }
      } catch (err) {
        console.error(err);
        alert('登录失败，请稍后重试');
      }
    });
  }
}

function initSendSms() {
  const sendBtn = document.getElementById('btn-send-sms') as HTMLButtonElement;
  if (!sendBtn) return;

  sendBtn.addEventListener('click', async () => {
    const form = document.getElementById('form-sms') as HTMLFormElement;
    if (!form) return;

    const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    const imgCodeInput = form.querySelector('input[name="img_code"]') as HTMLInputElement;
    const imgHashInput = form.querySelector('input[name="img_code_hash"]') as HTMLInputElement;

    const phone = phoneInput.value;
    const image_code = imgCodeInput.value;
    const image_code_hash = imgHashInput.value;

    if (!phone) {
      alert('请输入手机号');
      return;
    }
    if (!image_code) {
      alert('请输入图形验证码');
      return;
    }

    // Disable button
    sendBtn.disabled = true;
    const originalText = sendBtn.innerText;
    sendBtn.innerText = '发送中...';

    try {
      const res = await fetch('/api/validate-code/send/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          image_code,
          image_code_hash,
          type: 'user_client_phone_login', // Must match backend VALIDATE_CODE_TYPE
        }),
      });
      const result = await res.json();

      if (res.ok && result.code === 200) {
        alert('验证码已发送');
        // Start countdown
        let seconds = 60;
        sendBtn.innerText = `${seconds}s`;
        const timer = setInterval(() => {
          seconds--;
          if (seconds <= 0) {
            clearInterval(timer);
            sendBtn.disabled = false;
            sendBtn.innerText = originalText;
          } else {
            sendBtn.innerText = `${seconds}s`;
          }
        }, 1000);
      } else {
        alert(result.message || '发送失败');
        sendBtn.disabled = false;
        sendBtn.innerText = originalText;

        // Refresh captcha on failure might be a good idea
        const imgEle = form.querySelector('.code-img');
        if (imgEle) (imgEle as HTMLElement).click();
      }
    } catch (err) {
      console.error(err);
      alert('发送失败，请稍后重试');
      sendBtn.disabled = false;
      sendBtn.innerText = originalText;
    }
  });
}

document.querySelectorAll<HTMLInputElement>('input[name="redirect_uri"]').forEach((el) => {
  const query = new URLSearchParams(window.location.search);
  el.value = query.get('redirect_uri') || '';
});
