document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('photo-grid');
  if (!gallery) return;

  gallery.innerHTML = products.map(product => `<article class="brutal-card p-4">
    <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover rounded-xl border-2 border-black">
    <h2 class="font-black text-lg mt-4">${product.name}</h2>
    <p class="text-[#002BFF] font-black">${formatRupiah(product.price)}</p>
  </article>`).join('');
});
