import DesktopSidebar from "@/components/DesktopSidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">
      <DesktopSidebar />
      <Outlet />
    </div>
  );
}
