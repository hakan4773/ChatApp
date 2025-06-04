import Main from "./components/Main";
import LeftBar from "./components/LeftBar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white border-r border-gray-200 hidden md:block">
        <LeftBar />
      </aside>
      
      {/* Main content */}
      <main className="flex-1 md:w-3/4 bg-gray-100 overflow-auto">
        <Main />
      </main>
    </div>

  );
}
