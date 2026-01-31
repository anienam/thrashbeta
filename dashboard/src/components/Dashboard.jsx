import Navbar from "./Navbar";
import {
  FileText,
  Search,
  Calendar,
  MapPin,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex-1 bg-neutra-50 min-h-screen font-manrope">
      <Navbar title={"Dashboard Overview"} />

      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Welcome Banner - Spans 3 columns */}
          <section className="lg:col-span-3 bg-primary-50 rounded-2xl p-8 flex justify-between items-center relative overflow-hidden border border-primary-100">
            <div className="z-10">
              <h3 className="text-2xl font-bold text-primary-500 mb-2">
                Welcome back, Whareez!
              </h3>
              <p className="text-neutra-700">
                Your active reports: <span className="font-bold">2</span>
              </p>
            </div>
            {/* Calendar Illustration - Using your specific image */}
            <img
              src="/images/calendar-illustration.png"
              alt="Calendar"
              className="w-48 h-auto object-contain hidden md:block"
            />
          </section>

          {/* Next Pickup Card - Spans 1 column */}
          <div className="bg-white p-6 rounded-2xl border border-neutra-300 shadow-sm flex flex-col items-center text-center">
            <p className="text-sm text-neutra-600 font-medium mb-4">
              Next Pickup
            </p>
            <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mb-3 text-primary-500">
              <Calendar size={20} />
            </div>
            <p className="text-neutra-800 font-bold">Friday, January 15</p>
            <p className="text-xs text-neutra-500 mb-4">8:00 AM - 10:00 AM</p>
            <div className="flex items-center gap-1 text-neutra-500 text-xs mb-4">
              <MapPin size={14} /> <span>Ikeja, Lagos</span>
            </div>
            <button className="w-full bg-primary-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
              Add to Calendar
            </button>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <button className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-neutra-300 shadow-sm hover:border-primary-400 transition-all text-neutra-800 font-semibold group">
            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl group-hover:bg-indigo-100">
              <FileText size={20} />
            </div>
            Report New Issue
          </button>
          <button className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-neutra-300 shadow-sm hover:border-primary-400 transition-all text-neutra-800 font-semibold group">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-100">
              <Search size={20} />
            </div>
            Track Issue
          </button>
          <button className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-neutra-300 shadow-sm hover:border-primary-400 transition-all text-neutra-800 font-semibold group">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl group-hover:bg-emerald-100">
              <Calendar size={20} />
            </div>
            View Schedule
          </button>
        </div>

        {/* Recent Reports Table Section */}
        <div className="bg-white rounded-2xl border border-neutra-300 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center p-6 border-b border-neutra-100">
            <h4 className="font-bold text-neutra-800 flex items-center gap-2">
              <FileText size={18} className="text-indigo-400" /> Recent Reports
            </h4>
            <a
              href="#"
              className="text-primary-500 text-sm font-bold hover:underline"
            >
              View All Reports
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutra-50">
                <tr className="text-neutra-500 text-[11px] uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Photo</th>
                  <th className="px-6 py-4 font-semibold">Tracking ID</th>
                  <th className="px-6 py-4 font-semibold">Waste Type</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Date Reported</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Priority
                  </th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutra-100">
                <tr className="text-[13px] hover:bg-neutra-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 bg-neutra-200 rounded-lg overflow-hidden border border-neutra-300">
                      <img
                        src="/images/waste-sample.jpg"
                        alt="waste"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutra-700">
                    WM-2025-00003
                  </td>
                  <td className="px-6 py-4 text-neutra-600">
                    Illegal Dumping Site
                  </td>
                  <td className="px-6 py-4 text-neutra-600">Agege</td>
                  <td className="px-6 py-4 text-neutra-600">Jan 10, 2026</td>
                  <td className="px-6 py-4">
                    <div className="mx-auto w-fit px-3 py-1 bg-neutra-100 text-neutra-700 rounded-full text-[10px] font-bold border border-neutra-300">
                      ● Low
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[11px] font-bold border border-red-100 w-fit">
                      <AlertCircle size={12} /> Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutra-400">
                    <button className="hover:text-neutra-800">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
                {/* Repeat more rows as needed to match design */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
