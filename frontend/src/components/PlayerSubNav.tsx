import Link from "next/link";

interface PlayerSubNavProps {
  playerId: string;
  activeTab: "overview" | "gamelog" | "splits" | "advanced";
}

export const PlayerSubNav = ({ playerId, activeTab }: PlayerSubNavProps) => {
  const tabs = [
    { id: "overview", label: "Overview", href: `/players/${playerId}` },
    { id: "gamelog", label: "Game Log", href: `/players/${playerId}/gamelog` },
    { id: "splits", label: "Splits", href: `/players/${playerId}/splits` },
    // Advanced can be a separate page or anchor, let's make it a page for now to follow structure
    { id: "advanced", label: "Advanced", href: `/players/${playerId}/advanced` },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
