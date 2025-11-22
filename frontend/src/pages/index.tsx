import Hero from "@/components/Hero";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";

interface Team {
  team_id: string;
  nickname: string;
  abbreviation: string;
  city: string;
}

interface HomeProps {
  teams: Team[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const teams = await fetchAPI<Team[]>("/teams");
    return {
      props: {
        teams: teams.slice(0, 6), // Show first 6 teams
      },
    };
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return {
      props: {
        teams: [],
      },
    };
  }
};

export default function Home({ teams }: HomeProps) {
  return (
    <div>
      <Hero />

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Featured Teams</h2>
          <Link href="/teams" className="text-orange-600 hover:text-orange-700 font-medium">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link key={team.team_id} href={`/teams/${team.team_id}`} className="group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-slate-100 group-hover:border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {team.city} {team.nickname}
                    </h3>
                    <p className="text-slate-500 text-sm font-mono mt-1">{team.abbreviation}</p>
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
