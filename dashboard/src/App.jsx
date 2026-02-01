import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/report"
              element={<div className="p-10">Report Issue Page</div>}
            />
            <Route
              path="/track"
              element={<div className="p-10">Track Issue Page</div>}
            />
            <Route
              path="/reports"
              element={<div className="p-10">My Reports Page</div>}
            />
            <Route
              path="/schedule"
              element={<div className="p-10">Schedule Page</div>}
            />
            <Route
              path="/tips"
              element={<div className="p-10">Tips Page</div>}
            />
            <Route
              path="/profile"
              element={<div className="p-10">Profile Page</div>}
            />

            {/* 404 Catch-all */}
            <Route
              path="*"
              element={<div className="p-10">404 - Page Not Found</div>}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
