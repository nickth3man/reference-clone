import React from "react";
import Link from "next/link";
import { SeasonLeader } from "../../types";

interface LeadersCardProps {
  title: string;
  leaders: SeasonLeader[];
  valueLabel?: string;
}

export const LeadersCard: React.FC<LeadersCardProps> = ({ title, leaders, valueLabel }) => {
  const topLeader = leaders[0];
  const otherLeaders = leaders.slice(1);

  return (
    <div className="border border-gray-300 bg-white shadow-sm text-sm flex flex-col h-full">
      <div className="bg-gray-100 px-2 py-1 font-bold border-b border-gray-300 text-center uppercase tracking-wider text-xs text-gray-600">
        {title}
      </div>
      
      {/* Top Leader */}
      {topLeader ? (
        <div className="p-4 border-b border-gray-100 bg-blue-50/30 flex flex-col items-center text-center">
           {/* Image */}
           <div className="mb-2 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={topLeader.headshot_url || "https://via.placeholder.com/64"} 
                alt={topLeader.full_name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm bg-gray-200" 
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">1</div>
           </div>
           <Link href={`/players/${topLeader.player_id}`} className="font-bold text-blue-700 hover:underline text-base leading-tight">
              {topLeader.full_name}
           </Link>
           <div className="text-xs text-gray-500 mb-1 mt-0.5">{topLeader.team_id}</div>
           <div className="text-xl font-bold text-slate-800">
              {topLeader.value} <span className="text-xs font-normal text-gray-500">{valueLabel}</span>
           </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-400 italic">No data available</div>
      )}

      {/* Other Leaders */}
      <div className="divide-y divide-gray-100 flex-1">
        {otherLeaders.map((leader, index) => (
          <div key={leader.player_id} className="flex items-center p-2 hover:bg-blue-50">
             <div className="w-6 text-gray-400 text-xs font-mono text-right mr-2">{index + 2}.</div>
             <div className="flex-1 min-w-0">
                <Link href={`/players/${leader.player_id}`} className="font-medium text-blue-700 hover:underline block truncate text-xs">
                    {leader.full_name}
                </Link>
             </div>
             <div className="text-right font-bold ml-2 text-sm text-slate-700">
                 {leader.value}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

