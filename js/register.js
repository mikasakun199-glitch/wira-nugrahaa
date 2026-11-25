document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const message = document.getElementById('register-message');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    if (password !== confirm) {
      message.textContent = 'Konfirmasi kata sandi tidak sama.';
      message.className = 'mt-4 text-sm font-bold text-red-700';
      return;
    }
    const payload = {
      name: document.getElementById('register-name').value,
      email: document.getElementById('register-email').value,
      phone: document.getElementById('register-phone').value,
      password
    };
    requestApi('api/register.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message); return data; })
      .then(() => { message.textContent = 'Akun berhasil dibuat. Silakan login untuk melanjutkan.'; message.className = 'mt-4 text-sm font-bold text-green-700'; form.reset(); })
      .catch(error => { message.textContent = error.message; message.className = 'mt-4 text-sm font-bold text-red-700'; });
  });
});
