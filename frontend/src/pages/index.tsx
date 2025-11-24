import Hero from "@/components/Hero";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
import { TeamCard } from "@/components/molecules";
import { Button } from "@/components/atoms";

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
          <Link href="/teams">
            <Button variant="ghost" size="sm" endIcon={<span>&rarr;</span>} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.team_id} team={team} />
          ))}
        </div>
      </section>
    </div>
  );
}
