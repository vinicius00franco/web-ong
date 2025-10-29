interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="alert alert-danger" role="alert">
      {message}
    </div>
  );
};
