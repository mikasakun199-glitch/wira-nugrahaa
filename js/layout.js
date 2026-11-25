document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  if (!header) return;

  const currentPage = document.body.dataset.page || 'catalog';
  const activeNav = 'bg-[#002BFF] text-white px-5 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]';
  const catalogClass = currentPage === 'catalog' ? activeNav : '';
  const ordersClass = currentPage === 'orders' ? activeNav : '';
  const loginClass = ['login', 'register'].includes(currentPage) ? activeNav : '';
  header.className = 'w-full bg-[#FFFF00] border-b-[3.5px] border-black px-6 md:px-12 py-3.5 flex items-center justify-between sticky top-0 z-40';
  header.innerHTML = `
    <div class="flex items-baseline gap-2.5"><a href="index.html" class="text-2xl md:text-3xl font-black tracking-tight">Dapur Mas Bayu</a><span class="text-xs md:text-sm font-semibold text-neutral-800 hidden sm:inline">Makanan dan Cemilan</span></div>
    <nav class="flex items-center gap-4 md:gap-6">
      <a href="index.html" class="${catalogClass} font-bold text-sm hover:underline">Katalog</a>
      <a href="cek-pesanan.html" class="${ordersClass} font-bold text-sm hover:underline">Cek Pesanan</a>
      <a href="login.html" class="${loginClass} font-bold text-sm hover:underline">Login</a>
    </nav>`;
});
