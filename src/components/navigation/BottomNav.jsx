import { NavLink } from 'react-router-dom';

const menus = [
  { path: '/', label: '지도' },
  { path: '/collection', label: '도감' },
  { path: '/teacher', label: '선생님' },
];

function BottomNav() {
  return (
    <nav className="sticky bottom-0 grid grid-cols-3 border-t border-slate-200 bg-white">
      {menus.map((menu) => (
        <NavLink
          key={menu.path}
          to={menu.path}
          className={({ isActive }) =>
            `px-3 py-4 text-center text-sm font-semibold transition ${
              isActive ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-700'
            }`
          }
        >
          {menu.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
