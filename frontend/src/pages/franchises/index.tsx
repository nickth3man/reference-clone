import Link from "next/link";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
import type { Franchise } from "../../types";

interface FranchisesPageProps {
  franchises: Franchise[];
}

export const getServerSideProps: GetServerSideProps<FranchisesPageProps> = async () => {
  try {
    const franchises = await fetchAPI<Franchise[]>("/franchises");
    return {
      props: {
        franchises,
      },
    };
  } catch (error) {
    console.error("Failed to fetch franchises:", error);
    return {
      props: {
        franchises: [],
      },
    };
  }
};

export default function FranchisesIndex({ franchises }: FranchisesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFranchises = franchises.filter(
    (franchise) =>
      (franchise.original_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (franchise.franchise_id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Franchise Index</h1>
          <p className="text-slate-500 mt-1">
            Historical records for all {franchises.length} NBA franchises
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search franchises..."
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Franchise</th>
                <th className="px-6 py-3">Founded</th>
                <th className="px-6 py-3 text-right">Seasons</th>
                <th className="px-6 py-3 text-right">Wins</th>
                <th className="px-6 py-3 text-right">Losses</th>
                <th className="px-6 py-3 text-right">Titles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFranchises.map((franchise) => (
                <tr key={franchise.franchise_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <Link
                      href={`/franchises/${franchise.franchise_id}`}
                      className="hover:text-orange-600"
                    >
                      {franchise.original_name || franchise.franchise_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{franchise.founded_year}</td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    {franchise.total_seasons}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">{franchise.total_wins}</td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    {franchise.total_losses}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900 font-medium">
                    {franchise.total_championships}
                  </td>
                </tr>
              ))}
              {filteredFranchises.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No franchises found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

