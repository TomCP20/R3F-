import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export default function NavBarElement({ children, to }: Readonly<{ children: ReactNode; to: string; }>) {
  return (
    <li className="float-left">
      <NavLink to={to} className={({ isActive }) => ["block p-[16px] text-white text-center hover:bg-slate-800", (isActive ? "bg-slate-800" : "")].join(" ")}>
        {children}
      </NavLink>
    </li>
  );
}
