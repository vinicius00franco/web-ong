export const ProductCardSkeleton = () => {
  return (
    <div className="card" aria-hidden="true">
      <div
        className="card-img-top"
        style={{ height: '180px', backgroundColor: '#e0e0e0' }}
        data-testid="skeleton-image"
      ></div>
      <div className="card-body">
        <h5 className="card-title placeholder-glow">
          <span className="placeholder col-6" data-testid="skeleton-title"></span>
        </h5>
        <p className="card-text placeholder-glow">
          <span className="placeholder col-7" data-testid="skeleton-description"></span>
          <span className="placeholder col-4"></span>
          <span className="placeholder col-4"></span>
          <span className="placeholder col-6"></span>
        </p>
        <p className="card-text placeholder-glow">
          <span className="placeholder col-8" data-testid="skeleton-price"></span>
        </p>
      </div>
    </div>
  );
};
