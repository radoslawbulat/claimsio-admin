import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, FileUp, ChevronDown } from "lucide-react";
import AddDebtorModal from "@/components/AddDebtorModal";
import FileUploadModal from "@/components/FileUploadModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CoreMetrics } from "@/components/dashboard/CoreMetrics";
import { PortfolioAging } from "@/components/dashboard/PortfolioAging";
import { CollectionsTable } from "@/components/dashboard/CollectionsTable";
import { MonthlyRecoveryChart } from "@/components/dashboard/MonthlyRecoveryChart";
import { RecoveryTrends } from "@/components/dashboard/RecoveryTrends";

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

const fetchRecoveryTrends = async () => {
  const { data, error } = await supabase.functions.invoke('get-recovery-trends');
  if (error) throw error;
  return data;
};

const fetchMonthlyRecoveries = async () => {
  const { data, error } = await supabase.functions.invoke('get-monthly-recoveries');
  if (error) throw error;
  return data;
};

const Dashboard = () => {
  const [isAddDebtorOpen, setIsAddDebtorOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics
  });

  const { data: agingData, isLoading: isLoadingAging } = useQuery({
    queryKey: ['aging-data'],
    queryFn: fetchAgingData
  });

  const { data: recoveryTrends, isLoading: isLoadingRecoveryTrends } = useQuery({
    queryKey: ['recovery-trends'],
    queryFn: fetchRecoveryTrends
  });

  const { data: monthlyRecoveries, isLoading: isLoadingMonthlyRecoveries } = useQuery({
    queryKey: ['monthly-recoveries'],
    queryFn: fetchMonthlyRecoveries
  });

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="demo">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select portfolio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="demo">Demo</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                Start collection
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsFileUploadOpen(true)} className="gap-2">
                <FileUp size={16} />
                Upload CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAddDebtorOpen(true)} className="gap-2">
                <PlusCircle size={16} />
                Add a debtor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CoreMetrics 
        isLoading={isLoading}
        error={error}
        analytics={analytics}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioAging 
          isLoading={isLoadingAging}
          data={agingData || []}
        />
        <MonthlyRecoveryChart 
          isLoading={isLoadingMonthlyRecoveries}
          data={monthlyRecoveries || []}
        />
      </div>

      <div className="bg-white rounded-lg border border-input p-6">
        <h2 className="text-xl font-semibold mb-4">Latest Activity</h2>
        <CollectionsTable />
      </div>

      <AddDebtorModal 
        isOpen={isAddDebtorOpen}
        onClose={() => setIsAddDebtorOpen(false)}
      />
      
      <FileUploadModal
        isOpen={isFileUploadOpen}
        onClose={() => setIsFileUploadOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
