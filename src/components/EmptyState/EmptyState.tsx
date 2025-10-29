interface EmptyStateProps {
  message: string;
  imageUrl?: string;
}

export const EmptyState = ({ message, imageUrl }: EmptyStateProps) => {
  return (
    <div className="text-center">
      {imageUrl && <img src={imageUrl} alt="Empty state" className="img-fluid mb-3" style={{ maxWidth: '200px' }} />}
      <p>{message}</p>
    </div>
  );
};
