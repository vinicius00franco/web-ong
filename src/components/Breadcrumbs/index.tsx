import { Link } from 'react-router-dom';

type Breadcrumb = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps) => (
  <nav aria-label="breadcrumb">
    <ol className="breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <li
          key={crumb.href}
          className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
          aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
        >
          {index === breadcrumbs.length - 1 ? (
            crumb.label
          ) : (
            <Link to={crumb.href}>{crumb.label}</Link>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
