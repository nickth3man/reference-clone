import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { fetchAPI } from '../../lib/api';
import { Season } from '../../types';

export default function LeagueIndex() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI<Season[]>('/seasons')
      .then((data) => {
        setSeasons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">NBA Seasons</h1>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Season</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">League</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Champion</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">MVP</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ROY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {seasons.map((season) => (
                  <tr key={season.season_id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <Link href={`/leagues/${season.season_id}`} className="text-blue-600 hover:underline">
                        {season.season_id}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.league}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.champion_team_id || '-'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.mvp_player_id || '-'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{season.roy_player_id || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
