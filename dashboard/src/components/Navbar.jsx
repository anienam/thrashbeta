import { Bell } from "lucide-react";

export default function Navbar({ title }) {
  return (
    <header className="flex justify-between items-center h-18 px-8 bg-white border-b border-neutra-300 w-full font-manrope">
      {/* Title set to h-5 equivalent (text-xl) */}
      <h2 className="text-xl h-5 font-semibold text-neutra-900 flex items-center">
        {title}
      </h2>

      <div className="flex items-center gap-4">
        {/* Notification Bell: Exactly 32x32 (w-8 h-8) */}
        <button className="relative w-8 h-8 flex items-center justify-center bg-neutra-50 hover:bg-neutra-100 rounded-full text-neutra-500 transition-colors border border-neutra-100">
          <Bell size={16} />
          {/* Notification Dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#FB3748] rounded-full border-2 border-white"></span>
        </button>

        {/* User Avatar: Exactly 32x32 (w-8 h-8) */}
        <div className="cursor-pointer">
          <img
            src="https://i.pravatar.cc/32"
            className="w-8 h-8 rounded-full border border-neutra-300 object-cover"
            alt="User profile"
          />
        </div>
      </div>
    </header>
  );
}
