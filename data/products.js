const products = [
  { id: '1', name: 'Basreng Pedas', price: 10000, stock: 9, image: 'assets/images/basreng.png' },
  { id: '2', name: 'Makaroni', price: 10000, stock: 4, image: 'assets/images/makaroni.png' },
  { id: '3', name: 'Seblak', price: 23000, stock: 11, image: 'assets/images/seblak.png' },
  { id: '4', name: 'Bakso', price: 15000, stock: 7, image: 'assets/images/bakso.png' },
  { id: '5', name: 'Mie Ayam', price: 15000, stock: 9, image: 'assets/images/mie-ayam.png' },
  { id: '6', name: 'Soto Ayam', price: 15000, stock: 9, image: 'assets/images/soto-ayam.png' }
];

const formatRupiah = number => `Rp.${Number(number).toLocaleString('id-ID')}`;
