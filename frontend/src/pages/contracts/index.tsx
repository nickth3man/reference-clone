import { useState } from "react";
import { GetServerSideProps } from "next";
import { fetchAPI } from "@/lib/api";
import type { Contract } from "../../types";
import { Input, Card } from "@/components/atoms";

interface ContractsPageProps {
  contracts: Contract[];
}

export const getServerSideProps: GetServerSideProps<ContractsPageProps> = async () => {
  try {
    const contracts = await fetchAPI<Contract[]>("/contracts?limit=100");
    return {
      props: {
        contracts,
      },
    };
  } catch (error) {
    console.error("Failed to fetch contracts:", error);
    return {
      props: {
        contracts: [],
      },
    };
  }
};

export default function ContractsIndex({ contracts }: ContractsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContracts = contracts.filter(
    (contract) =>
      (contract.player_id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contract.team_id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Player Contracts</h1>
          <p className="text-slate-500 mt-1">
            Top active contracts
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Input
            variant="search"
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<span>🔍</span>}
            fullWidth
          />
        </div>
      </div>

      <Card variant="bordered" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Player</th>
                <th className="px-6 py-3">Team</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Years</th>
                <th className="px-6 py-3 text-right">Total Value</th>
                <th className="px-6 py-3 text-right">Guaranteed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((contract) => (
                <tr key={contract.contract_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{contract.player_id}</td>
                  <td className="px-6 py-4 text-slate-600">{contract.team_id}</td>
                  <td className="px-6 py-4 text-slate-600">{contract.contract_type}</td>
                  <td className="px-6 py-4 text-slate-600">{contract.years}</td>
                  <td className="px-6 py-4 text-right text-green-600 font-medium">
                    {contract.total_value ? `$${contract.total_value.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    {contract.guaranteed_money ? `$${contract.guaranteed_money.toLocaleString()}` : "-"}
                  </td>
                </tr>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No contracts found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

