import { useState } from "react";
import { Image as ImageIcon, Pencil, Trash2 } from "lucide-react";

function ProductCard({ product, onEdit, onDelete }) {
  const [failedImageUrl, setFailedImageUrl] = useState("");

  const price = Number(product.price);
  const formattedPrice = Number.isFinite(price)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)
    : product.price;

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {product.imageUrl && failedImageUrl !== product.imageUrl ? (
          <img
            className="product-image"
            src={product.imageUrl}
            alt={product.name}
            onError={() => setFailedImageUrl(product.imageUrl)}
          />
        ) : (
          <div className="product-image-fallback" aria-label={`${product.name} image unavailable`}>
            <ImageIcon size={24} strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}
        <div className="product-actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => onEdit(product)}
            aria-label={`Edit ${product.name}`}
            title="Edit product"
          >
            <Pencil size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button delete-icon-button"
            onClick={() => onDelete(product)}
            aria-label={`Delete ${product.name}`}
            title="Delete product"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="product-card-body">
        <h2 className="product-name" title={product.name}>{product.name}</h2>
        <p className="product-price">{formattedPrice}</p>
        <p className="product-description" title={product.desc || "No description"}>
          {product.desc || "No description"}
        </p>
      </div>
    </article>
  );
}

export default ProductCard;