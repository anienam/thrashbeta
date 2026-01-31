import logo from "../assets/logo.svg";

export default function Sidebar() {
  const menuItems = [
    { label: "Dashboard", active: true },
    { label: "Report Issue", active: false },
    { label: "Track Issue", active: false },
    { label: "My Reports", active: false },
  ];

  return (
    <aside className="w-60 h-screen bg-white border-neutra-300 flex flex-col justify-between items-start sticky top-0">
      <div>
        <div className="flex items-center justify-center w-full h-18 px-5 py-4 border-b border-neutra-300">
          <img
            src={logo}
            alt="Trashbeta Logo"
            className="w-fit h-fit overflow-hidden"
          />
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`block px-4 py-3 rounded-xl transition-colors ${item.active ? "bg-primary-100 text-primary-500 font-semibold rounded-full" : "text-neutra-700 hover:bg-neutra-50"}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="rounded-full"
            alt="User"
          />
          <div>
            <p className="text-sm font-bold">Whareez</p>
            <p className="text-xs text-gray-400 text-truncate">whareezdesign</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
