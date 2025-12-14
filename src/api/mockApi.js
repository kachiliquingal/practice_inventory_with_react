let productsDB = [
  { id: 1, name: 'Laptop Gamer', category: 'Electrónica', price: 1200, inStock: true },
  { id: 2, name: 'Camiseta Básica', category: 'Ropa', price: 20, inStock: true },
  { id: 3, name: 'Sofá Cama', category: 'Hogar', price: 350, inStock: false },
  { id: 4, name: 'Auriculares', category: 'Electrónica', price: 50, inStock: true },
  { id: 5, name: 'Jeans', category: 'Ropa', price: 45, inStock: false },
];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const fetchProducts = async () => {
  await delay();
  return [...productsDB];
};

export const addProduct = async (product) => {
  await delay();
  const newId = productsDB.length > 0 ? Math.max(...productsDB.map(p => p.id)) + 1 : 1;
  const newProduct = { id: newId, ...product, inStock: true };
  productsDB.push(newProduct);
  return newProduct;
};

export const toggleProductStatus = async (id) => {
  await delay();
  const index = productsDB.findIndex(p => p.id === id);
  if (index !== -1) {
    productsDB[index].inStock = !productsDB[index].inStock;
  }
  return true;
};

export const deleteProducts = async (ids) => {
  await delay();
  productsDB = productsDB.filter(p => !ids.includes(p.id));
  return true;
};