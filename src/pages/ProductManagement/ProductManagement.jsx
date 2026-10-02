import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import { createProduct, deleteProduct as deleteProductRequest, getProducts, updateProduct } from "../../services/api.js";
import ProductCard from "../../components/ProductCard.jsx";
import ProductFormModal from "../../components/ProductFormModal.jsx";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal.jsx";
import Toast from "../../components/Toast.jsx";
import "./ProductManagement.css";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deferredSearch = useDeferredValue(debouncedSearch);

  const loadProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      const items = Array.isArray(response) ? response : response?.value;
      if (!Array.isArray(items)) throw new Error("The products response was not a list.");

      setProducts(items.map((product) => ({
        ...product,
        id: product._id,
        desc: product.desc ?? "",
      })));
      setLoadFailed(false);
    } catch (error) {
      console.error("Failed to load products:", error);
      setLoadFailed(true);
      if (!error.authExpired) {
        toast.error(error.message || error.error || "Couldn't load products. Check your connection and try again.", {
          toastId: "products-load-error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadProducts);
  }, [loadProducts]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(deferredSearch.toLowerCase()),
  );

  function openAddModal() {
    setActiveProduct(null);
    setIsFormOpen(true);
  }

  function retryLoadProducts() {
    setIsLoading(true);
    void loadProducts();
  }

  function openEditModal(product) {
    setActiveProduct(product);
    setIsFormOpen(true);
  }

  async function saveProduct(values) {
    setIsSaving(true);
    try {
      if (activeProduct) {
        await updateProduct(activeProduct._id, values);
        toast.success("Product updated.");
      } else {
        await createProduct(values);
        toast.success("Product added.");
      }
      setIsFormOpen(false);
      await loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      if (!error.authExpired) {
        toast.error(error.message || error.error || "Couldn't save this product. Check your connection and try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProduct() {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProductRequest(productToDelete._id);
      toast.success("Product deleted.");
      setProductToDelete(null);
      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      if (!error.authExpired) {
        toast.error(error.message || error.error || "Couldn't delete this product. Check your connection and try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="products-page">
      <Toast />
      <main className="products-main">
        <header className="page-header">
          <h1>Products</h1>
          <button className="button button-primary" type="button" onClick={openAddModal}>
            Add product
          </button>
        </header>

        <div className="product-search">
          <Search size={18} aria-hidden="true" />
          <label className="visually-hidden" htmlFor="product-search-input">Search products</label>
          <input
            id="product-search-input"
            type="search"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="product-grid skeleton-grid" aria-label="Loading products" aria-busy="true">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="skeleton-card" key={index}>
                <div className="skeleton-image" />
                <div className="skeleton-line skeleton-name" />
                <div className="skeleton-line skeleton-price" />
                <div className="skeleton-line skeleton-description" />
              </div>
            ))}
          </div>
        ) : loadFailed ? (
          <section className="empty-state" aria-live="polite">
            <p>Couldn't load products. Check your connection.</p>
            <button className="button button-secondary" type="button" onClick={retryLoadProducts}>
              Try again
            </button>
          </section>
        ) : filteredProducts.length === 0 ? (
          <section className="empty-state" aria-live="polite">
            <p>{products.length === 0 ? "No products yet" : "No products found"}</p>
            {products.length === 0 && (
              <button className="button button-primary" type="button" onClick={openAddModal}>
                Add product
              </button>
            )}
          </section>
        ) : (
          <section className="product-grid" aria-label="Product list">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={openEditModal}
                onDelete={setProductToDelete}
              />
            ))}
          </section>
        )}
      </main>

      {isFormOpen && (
        <ProductFormModal
          product={activeProduct}
          onClose={() => setIsFormOpen(false)}
          onSave={saveProduct}
          isSaving={isSaving}
        />
      )}
      {productToDelete && (
        <ConfirmDeleteModal
          product={productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={deleteProduct}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default ProductManagement;