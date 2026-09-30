import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [products, SetProducts] = useState([]);
  const [newProductsInfo, SetNewProductsInfo] = useState({
    id: "",
    name: "",
    price: "",
    desc: "",
    imageUrl: "",
  });

  const [editingId, SetEditingId] = useState(null);

  async function fetchProducts() {
    try {
      const productRes = await axios.get("http://localhost:5050/products");
      const productList = Array.isArray(productRes.data)
        ? productRes.data
        : productRes.data.value ?? [];
      SetProducts(
        productList.map((product) => ({
          ...product,
          id: product._id ?? product.id,
          desc: product.desc ?? "",
        })),
      );
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductInfoChange = (e) => {
    SetNewProductsInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function resetForm() {
    SetNewProductsInfo({ id: "", name: "", price: "", desc: "", imageUrl: "" });
    SetEditingId(null);
  }

  function startEdit(product) {
    SetNewProductsInfo({
      id: product.id,
      name: product.name,
      price: product.price,
      desc: product.desc,
      imageUrl: product.imageUrl,
    });
    SetEditingId(product.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5050/products/${editingId}`, newProductsInfo);
        toast.success("Product updated successfully");
      } else {
        await axios.post("http://localhost:5050/products", newProductsInfo);
        toast.success("Product created successfully");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteProduct(id) {
    try {
      await axios.delete(`http://localhost:5050/products/${id}`);
      toast.success("Product deleted successfully");
      if (editingId === id) resetForm();
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Product Inventory</h1>
          <p className="text-stone-500 mt-1">Add, edit, and remove products from your catalog.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Add / Update form */}
          <aside className="lg:sticky lg:top-10 h-fit bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-medium text-stone-700 mb-4">
              {editingId ? "Update product" : "Add a new product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-stone-500 mb-1" htmlFor="id">
                  Product ID
                </label>
                <input
                  id="id"
                  name="id"
                  type="text"
                  value={newProductsInfo.id}
                  onChange={handleProductInfoChange}
                  disabled={!!editingId}
                  placeholder="e.g. p-001"
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:bg-stone-100 disabled:text-stone-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={newProductsInfo.name}
                  onChange={handleProductInfoChange}
                  placeholder="Product name"
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1" htmlFor="price">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={newProductsInfo.price}
                  onChange={handleProductInfoChange}
                  placeholder="0.00"
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1" htmlFor="desc">
                  Description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  rows={3}
                  value={newProductsInfo.desc}
                  onChange={handleProductInfoChange}
                  placeholder="Short description"
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1" htmlFor="imageUrl">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="text"
                  value={newProductsInfo.imageUrl}
                  onChange={handleProductInfoChange}
                  placeholder="https://..."
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-teal-700 text-white text-sm font-medium py-2 hover:bg-teal-800 transition-colors"
                >
                  {editingId ? "Save changes" : "Add product"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-md border border-stone-300 text-stone-600 text-sm font-medium px-3 py-2 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </aside>

          {/* Product cards */}
          <section>
            {products.length === 0 ? (
              <div className="border border-dashed border-stone-300 rounded-xl p-12 text-center text-stone-400 text-sm">
                No products yet. Add one to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-stone-100">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-stone-900">{product.name}</h3>
                        <span className="text-teal-700 font-semibold whitespace-nowrap">
                          ${product.price}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500 mt-1 flex-1">{product.desc}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => startEdit(product)}
                          className="flex-1 text-sm font-medium text-stone-700 border border-stone-300 rounded-md py-1.5 hover:bg-stone-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="flex-1 text-sm font-medium text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;