import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <div className="card h-100">
      <img
        src={product.image_url}
        className="card-img-top img-fluid"
        alt={product.name}
        loading="lazy"
        width="150"
        height="150"
        style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="card-text">
          <strong>Categoria:</strong> {product.category}
        </p>
        <p className="card-text">
          <strong>Preço:</strong> R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
        <div className="mt-auto">
          <button className="btn btn-secondary me-2" onClick={() => onEdit(product.id)}>
            Editar
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(product.id)}>
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};
