document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const message = document.getElementById('login-message');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    requestApi('api/login.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message); return data; })
      .then(data => { sessionStorage.setItem('dmbUser', JSON.stringify(data.user)); window.location.href = 'dashboard.html'; })
      .catch(error => { message.textContent = error.message; message.className = 'mt-4 text-sm font-bold text-red-700'; });
  });
});
