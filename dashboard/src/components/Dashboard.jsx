import Navbar from "./Navbar";

export default function Dashboard() {
  return (
    <div className="flex-1">
      <Navbar title={"Dashboard Overview"} />

      {/* Welcome Banner */}
      <section className="bg-brand-light rounded-xl p-10 mb-8 flex justify-between items-center relative overflow-hidden">
        <div>
          <h3 className="text-3xl font-bold text-brand-green mb-2">
            Welcome back, Whareez!
          </h3>
          <p className="text-gray-600">
            Your active reports: <span className="font-bold">2</span>
          </p>
        </div>
        <div className="hidden md:block">
          {/* Calendar Illustration Placeholder */}
          <div className="w-32 h-32 bg-brand-green opacity-10 rounded-full" />
        </div>
      </section>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <button className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-brand-green transition-all text-gray-700">
          Report New Issue
        </button>
        <button className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-brand-green transition-all text-gray-700">
          Track Issue
        </button>
        <button className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-brand-green transition-all text-gray-700">
          View Schedule
        </button>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-brand-green">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2">
            Next Pickup
          </p>
          <p className="text-brand-green font-bold">Friday, January 15</p>
          <p className="text-xs text-gray-400 mb-4">8:00 AM - 10:00 AM</p>
          <button className="w-full bg-brand-green text-white py-2 rounded-lg text-sm font-medium">
            Add to Calendar
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold">Recent Reports</h4>
          <a href="#" className="text-brand-green text-sm font-semibold">
            View All Reports
          </a>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs uppercase border-b border-gray-50">
              <th className="pb-4 font-medium">Photo</th>
              <th className="pb-4 font-medium">Tracking ID</th>
              <th className="pb-4 font-medium">Waste Type</th>
              <th className="pb-4 font-medium">Location</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="text-sm">
              <td className="py-4">
                <div className="w-12 h-8 bg-gray-200 rounded" />
              </td>
              <td className="py-4 font-medium text-gray-600">WM-2025-00003</td>
              <td className="py-4 text-gray-500">Illegal Dumping Site</td>
              <td className="py-4 text-gray-500">Agege</td>
              <td className="py-4">
                <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs">
                  Pending
                </span>
              </td>
            </tr>
            {/* Repeat rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
