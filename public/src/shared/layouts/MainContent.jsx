import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainContent({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}