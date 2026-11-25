const rupiah = value => `Rp.${Number(value).toLocaleString('id-ID')}`;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tracking-form');
  const result = document.getElementById('order-result');
  const message = document.getElementById('tracking-message');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const orderNumber = document.getElementById('order-number').value.trim().toUpperCase();
    requestApi(`api/order.php?number=${encodeURIComponent(orderNumber)}`)
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message); return data; })
      .then(order => { document.getElementById('result-order-number').textContent = order.order_number; document.getElementById('result-status').textContent = order.status; document.getElementById('result-customer').textContent = order.customer_name; document.getElementById('result-method').textContent = order.method; document.getElementById('result-items').innerHTML = order.items.map(item => `<li class="flex justify-between gap-4 bg-neutral-50 border-2 border-black rounded-lg p-3"><span class="font-bold">${item.name} <span class="text-neutral-500">(${item.quantity}x)</span></span><span class="font-black">${rupiah(item.total)}</span></li>`).join(''); document.getElementById('result-total').textContent = rupiah(order.total); message.className = 'hidden'; result.classList.remove('hidden'); })
      .catch(error => { result.classList.add('hidden'); message.textContent = error.message; message.className = 'mt-4 text-sm font-bold text-red-700'; });
  });
});
