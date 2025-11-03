import { NavLink } from 'react-router-dom';

const Sidebar = () => (
  <div className="d-flex flex-column p-3 bg-light h-100">
    <h6 className="text-muted text-uppercase mb-3 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
      Menu Principal
    </h6>
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item mb-1">
        <NavLink 
          to="/ong" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}
          end
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
          </svg>
          Dashboard
        </NavLink>
      </li>
      <li className="mb-1">
        <NavLink 
          to="/ong/products" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          Produtos
        </NavLink>
      </li>
      <li className="mb-1">
        <NavLink 
          to="/ong/users" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
          </svg>
          Usuários
        </NavLink>
      </li>
    </ul>
    
    <hr />
    
    <div className="text-muted small px-2">
      <p className="mb-1">
        <strong>Sistema de Gestão</strong>
      </p>
      <p className="mb-0" style={{ fontSize: '0.75rem' }}>
        v1.0.0 - Beta
      </p>
    </div>
  </div>
);

export default Sidebar;
