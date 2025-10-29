import { NavLink } from 'react-router-dom';

const Sidebar = () => (
  <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '280px' }}>
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <NavLink to="/ong" className="nav-link" end>
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink to="/ong/products" className="nav-link">
          Products
        </NavLink>
      </li>
    </ul>
  </div>
);

export default Sidebar;
