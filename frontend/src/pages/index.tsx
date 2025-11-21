import Hero from "@/components/Hero";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Team {
  team_id: string;
  nickname: string;
  abbreviation: string;
  city: string;
}

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    // Fetch teams from backend
    fetch("http://localhost:8001/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data.slice(0, 6))) // Show first 6 teams
      .catch((err) => console.error("Failed to fetch teams:", err));
  }, []);

  return (
    <div>
      <Hero />

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Featured Teams</h2>
          <Link
            href="/teams"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team.team_id}
              href={`/teams/${team.team_id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-slate-100 group-hover:border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {team.city} {team.nickname}
                    </h3>
                    <p className="text-slate-500 text-sm font-mono mt-1">
                      {team.abbreviation}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                    {team.abbreviation.substring(0, 2)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
