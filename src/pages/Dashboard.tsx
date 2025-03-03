
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddDebtorModal from "@/components/AddDebtorModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CoreMetrics } from "@/components/dashboard/CoreMetrics";
import { PortfolioAging } from "@/components/dashboard/PortfolioAging";

const fetchAnalytics = async () => {
  const { data, error } = await supabase.functions.invoke('get-analytics');
  if (error) throw error;
  return data;
};

const fetchAgingData = async () => {
  const { data, error } = await supabase.functions.invoke('get-aging-data');
  if (error) throw error;
  return data;
};

const Dashboard = () => {
  const [isAddDebtorOpen, setIsAddDebtorOpen] = useState(false);

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics
  });

  const { data: agingData, isLoading: isLoadingAging } = useQuery({
    queryKey: ['aging-data'],
    queryFn: fetchAgingData
  });

  return (
    <div className="space-y-8 animate-fade-in bg-[#f9fafb] min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Performance</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select portfolio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Portfolios</SelectItem>
              <SelectItem value="npl">NPL</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="gap-2"
            onClick={() => setIsAddDebtorOpen(true)}
          >
            <PlusCircle size={20} />
            Add a debtor
          </Button>
        </div>
      </div>

      <CoreMetrics 
        isLoading={isLoading}
        error={error}
        analytics={analytics}
      />

      <PortfolioAging 
        isLoading={isLoadingAging}
        data={agingData || []}
      />

      <AddDebtorModal 
        isOpen={isAddDebtorOpen}
        onClose={() => setIsAddDebtorOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
