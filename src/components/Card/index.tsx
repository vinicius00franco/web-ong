import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTextProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Title: React.FC<CardTitleProps>;
  Text: React.FC<CardTextProps>;
} = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
};

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <h5 className={`card-title ${className}`}>
      {children}
    </h5>
  );
};

const CardText: React.FC<CardTextProps> = ({ children, className = '' }) => {
  return (
    <p className={`card-text ${className}`}>
      {children}
    </p>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Title = CardTitle;
Card.Text = CardText;

export default Card;