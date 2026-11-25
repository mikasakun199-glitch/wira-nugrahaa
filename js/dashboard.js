document.addEventListener('DOMContentLoaded', () => {
  const savedUser = sessionStorage.getItem('dmbUser');
  if (!savedUser) { window.location.href = 'login.html'; return; }
  const user = JSON.parse(savedUser);
  document.getElementById('dashboard-name').textContent = user.name || 'Pelanggan';
  document.getElementById('profile-name').textContent = user.name || '-';
  document.getElementById('profile-email').textContent = user.email || '-';
  document.getElementById('profile-phone').textContent = user.phone || '-';
  document.getElementById('logout-button').addEventListener('click', () => { sessionStorage.removeItem('dmbUser'); window.location.href = 'login.html'; });
});
