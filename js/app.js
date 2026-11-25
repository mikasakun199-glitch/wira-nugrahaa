let cart = [];
let deliveryMethod = 'pickup';

function productCard(product) {
  return `<article class="brutal-card flex flex-col" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-stock="${product.stock}">
    <div class="menu-img-container"><img src="${product.image}" alt="${product.name}" class="menu-img"></div>
    <div class="p-4 flex-1 flex flex-col justify-between"><div>
      <h3 class="font-black text-base text-black mb-1">${product.name}</h3>
      <div class="text-[#002BFF] font-black text-sm mb-0.5">${formatRupiah(product.price)}</div>
      <div class="text-neutral-500 text-xs font-semibold mb-3">Stok ${product.stock}</div>
    </div><div class="flex items-center gap-2">
      <input type="number" value="1" min="1" max="${product.stock}" class="qty-input w-12 py-1.5 px-1.5 text-center text-sm font-bold brutal-input bg-white">
      <button class="add-to-cart-btn flex-1 bg-[#FFFF00] text-black py-2 px-3 brutal-btn text-xs font-black hover:bg-yellow-300">+ Keranjang</button>
    </div></div>
  </article>`;
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (grid) grid.innerHTML = products.map(productCard).join('');
  document.querySelectorAll('.add-to-cart-btn').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.brutal-card');
    addToCart(card.dataset.id, card.dataset.name, Number(card.dataset.price), Number(card.querySelector('.qty-input').value) || 1, Number(card.dataset.stock));
  }));
}

function addToCart(id, name, price, quantity, stock) {
  const existing = cart.find(item => item.id === id);
  if (quantity < 1 || (existing ? existing.qty + quantity : quantity) > stock) return alert(`Jumlah melebihi stok yang tersedia (${stock})`);
  if (existing) existing.qty += quantity;
  else cart.push({ id, name, price, qty: quantity, stock });
  renderCart();
}

function removeFromCart(id) { cart = cart.filter(item => item.id !== id); renderCart(); }
function updateCartQty(id, delta) {
  const item = cart.find(entry => entry.id === id); if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else if (item.qty > item.stock) { item.qty = item.stock; alert(`Stok maksimal adalah ${item.stock}`); }
  renderCart();
}

function renderCart() {
  const empty = document.getElementById('empty-cart-msg'), list = document.getElementById('cart-items-list'), summary = document.getElementById('cart-summary'), totalEl = document.getElementById('cart-total-price');
  if (!empty || !list) return;
  empty.classList.toggle('hidden', cart.length > 0); list.classList.toggle('hidden', cart.length === 0); summary.classList.toggle('hidden', cart.length === 0);
  list.innerHTML = ''; let total = 0;
  cart.forEach(item => { const subtotal = item.price * item.qty; total += subtotal; const li = document.createElement('li'); li.className = 'bg-white border-2 border-black rounded-lg p-2.5 shadow-[2px_2px_0px_#000] flex items-center justify-between'; li.innerHTML = `<div class="flex-1 pr-2"><div class="font-extrabold text-xs">${item.name}</div><div class="text-[11px] text-neutral-600">${formatRupiah(item.price)} x ${item.qty}</div><div class="text-xs font-black text-[#002BFF]">${formatRupiah(subtotal)}</div></div><div class="flex items-center gap-1.5"><button onclick="updateCartQty('${item.id}', -1)" class="w-6 h-6 bg-neutral-200 border border-black rounded font-black">-</button><span class="text-xs font-black w-4 text-center">${item.qty}</span><button onclick="updateCartQty('${item.id}', 1)" class="w-6 h-6 bg-neutral-200 border border-black rounded font-black">+</button><button onclick="removeFromCart('${item.id}')" class="ml-1 text-red-600 font-bold">✕</button></div>`; list.appendChild(li); });
  if (totalEl) totalEl.textContent = formatRupiah(total);
}

function setDeliveryMethod(method) { deliveryMethod = method; const active = 'py-2 px-3 text-xs font-black rounded-lg border-2 border-black bg-[#002BFF] text-white shadow-[2px_2px_0px_#000] transition-all', idle = 'py-2 px-3 text-xs font-black rounded-lg border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-neutral-100 transition-all'; document.getElementById('btn-pickup').className = method === 'pickup' ? active : idle; document.getElementById('btn-delivery').className = method === 'delivery' ? active : idle; }

function submitOrder() {
  if (!cart.length) return alert('Keranjang belanja masih kosong.');
  const name = document.getElementById('cust-name').value.trim(), phone = document.getElementById('cust-phone').value.trim(); if (!name || !phone) return alert('Mohon isi nama dan nomor HP/WhatsApp.');
  let total = 0, text = `*Halo Dapur Mas Bayu, saya mau pesan:*%0A%0A*Nama:* ${name}%0A*No. HP:* ${phone}%0A*Metode:* ${deliveryMethod === 'pickup' ? 'Ambil Sendiri' : 'Diantar'}%0A%0A*Daftar Menu:*%0A`;
  cart.forEach((item, index) => { const subtotal = item.price * item.qty; total += subtotal; text += `${index + 1}. ${item.name} (${item.qty}x) = ${formatRupiah(subtotal)}%0A`; });
  window.open(`https://wa.me/6281234567890?text=${text}%0A*Total Pembayaran:* ${formatRupiah(total)}%0A%0ATerima kasih!`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => { renderProducts(); renderCart(); });
