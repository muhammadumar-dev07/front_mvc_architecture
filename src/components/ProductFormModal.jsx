import { useState } from "react";
import DialogShell from "./DialogShell.jsx";

function ProductFormModal({ product, onClose, onSave, isSaving }) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    price: product?.price === undefined ? "" : String(product.price),
    imageUrl: product?.imageUrl ?? "",
    desc: product?.desc ?? "",
  });
  const [errors, setErrors] = useState({});

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const price = Number(form.price);

    if (!form.name.trim()) nextErrors.name = "Enter a product name.";
    if (!form.price.trim()) nextErrors.price = "Enter a price.";
    else if (!Number.isFinite(price) || price <= 0) {
      nextErrors.price = "Price must be greater than zero.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      name: form.name.trim(),
      price,
      imageUrl: form.imageUrl.trim(),
      desc: form.desc.trim(),
    });
  }

  return (
    <DialogShell
      title={product ? "Edit product" : "Add product"}
      onClose={onClose}
      busy={isSaving}
    >
      <form className="product-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="product-name">Name</label>
          <input
            id="product-name"
            name="name"
            autoComplete="off"
            value={form.name}
            onChange={updateField}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "product-name-error" : undefined}
          />
          {errors.name && <p className="field-error" id="product-name-error">{errors.name}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="product-price">Price</label>
          <input
            id="product-price"
            name="price"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={form.price}
            onChange={updateField}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? "product-price-error" : undefined}
          />
          {errors.price && <p className="field-error" id="product-price-error">{errors.price}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="product-image-url">Image URL</label>
          <input
            id="product-image-url"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={updateField}
            placeholder="https://"
          />
        </div>

        <div className="form-field">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            name="desc"
            rows={4}
            value={form.desc}
            onChange={updateField}
          />
        </div>

        <footer className="dialog-footer">
          <button className="button button-secondary" type="button" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button className="button button-primary" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : product ? "Save changes" : "Add product"}
          </button>
        </footer>
      </form>
    </DialogShell>
  );
}

export default ProductFormModal;