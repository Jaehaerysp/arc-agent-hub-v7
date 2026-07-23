import { navigation } from "@/app/navigation";

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-border bg-card">
      <div className="p-6">
        <h1 className="text-xl font-bold">
          Arc Agent Hub
        </h1>
      </div>

      {navigation.map((group) => (
        <div key={group.section} className="mb-8">
          <p className="px-6 text-xs uppercase opacity-60">
            {group.section}
          </p>

          {group.items.map((item) => (
            <button
              key={item.title}
              className="flex w-full items-center gap-3 px-6 py-3 hover:bg-muted"
            >
              <item.icon size={18} />
              {item.title}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}