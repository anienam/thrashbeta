import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Search,
  ClipboardList,
  Calendar,
  Lightbulb,
  User,
  ChevronRight,
} from "lucide-react";
import logo from "../assets/logo.svg";

export default function Sidebar() {
  const linkStyles = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 mx-4 transition-colors font-medium text-xs ${
      isActive
        ? "bg-primary-50 text-primary-500 rounded-full"
        : "text-neutra-700 hover:bg-neutra-50 rounded-xl"
    }`;

  return (
    <aside className="w-60 h-screen bg-white flex flex-col border-r border-neutra-300 sticky top-0 overflow-hidden font-manrope">
      {/* Logo Container */}
      <div className="h-18 flex items-center justify-center px-4 py-3 border-b border-neutra-300">
        <img src={logo} alt="Trashbeta Logo" className="h-8 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col mt-5">
        <NavLink to="/" className={linkStyles}>
          <LayoutDashboard size={16} /> <span>Dashboard</span>
        </NavLink>

        <div className="my-2 border-t border-neutra-300" />

        <div className="space-y-1">
          <NavLink to="/report" className={linkStyles}>
            <FileText size={16} /> <span>Report Issue</span>
          </NavLink>
          <NavLink to="/track" className={linkStyles}>
            <Search size={16} /> <span>Track Issue</span>
          </NavLink>
          <NavLink to="/reports" className={linkStyles}>
            <ClipboardList size={16} /> <span>My Reports</span>
          </NavLink>
        </div>

        <div className="my-2 border-t border-neutra-300" />

        <div className="space-y-1">
          <NavLink to="/schedule" className={linkStyles}>
            <Calendar size={16} /> <span>Schedule</span>
          </NavLink>
          <NavLink to="/tips" className={linkStyles}>
            <Lightbulb size={16} /> <span>Tips</span>
          </NavLink>
        </div>

        <div className="my-2 border-t border-neutra-300" />

        <NavLink to="/profile" className={linkStyles}>
          <User size={16} /> <span>Profile</span>
        </NavLink>
      </nav>

      {/* Illustration Container - Stretched to match image */}
      <div className="px-4 my-2">
        <img
          src="/images/recycling-pana.png"
          alt="Recycling"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* User Profile - Fixed at the very bottom */}
      <div className="px-5 py-4 border-t border-neutra-300">
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              className="w-8 h-8 rounded-full border border-neutra-100"
              alt="User Image"
            />
            <div className="leading-tight">
              <p className="text-sm font-medium text-neutra-800">Whareez</p>
              <p className="text-xs text-neutra-600">whareezdesign</p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-neutra-400 group-hover:text-neutra-800 transition-colors"
          />
        </div>
      </div>
    </aside>
  );
}
