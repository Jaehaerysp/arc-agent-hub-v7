export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-8">
      <input
        placeholder="Search..."
        className="w-96 rounded-lg border px-4 py-2"
      />

      <div className="flex items-center gap-4">
        Notifications

        Wallet
      </div>
    </header>
  );
}