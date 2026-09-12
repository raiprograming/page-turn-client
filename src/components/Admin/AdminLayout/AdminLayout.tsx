import { NavLink } from "react-router";
import classnames from "./admin-layout.module.css";

const adminTabs = [
  { label: "News", href: "/admin/news" },
  { label: "Read", href: "/admin/read" },
  { label: "Book Marketplace", href: "/admin/books" },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={classnames.adminLayout}>
      <div className={classnames.tabGroupContainer}>
        <nav className={classnames.tabGroup}>
          {adminTabs.map((tab) => (
            <NavLink
              key={tab.href}
              to={tab.href}
              className={({ isActive }) => (isActive ? classnames.tabLinkActive : classnames.tabLink)}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={classnames.moduleContainer}>{children}</div>
    </div>
  );
}

export default AdminLayout;