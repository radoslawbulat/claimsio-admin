
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, ComposedChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddDebtorModal from "@/components/AddDebtorModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pl-PL').format(value);
};

const Dashboard = () => {
  const [isAddDebtorOpen, setIsAddDebtorOpen] = useState(false);

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics
  });

  const { data: agingData, isLoading: isLoadingAging, error: agingError } = useQuery({
    queryKey: ['aging-data'],
    queryFn: fetchAgingData
  });

  return (
    <div className="space-y-8 animate-fade-in bg-[#f9fafb] min-h-screen p-6">
      {/* Header Section */}
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

      {/* Core Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : error ? "Error" : formatCurrency(analytics.portfolioValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Recovered Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : error ? "Error" : formatCurrency(analytics.recoveredValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Recovery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : error ? "Error" : `${analytics.recoveryRate}%`}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : error ? "Error" : formatNumber(analytics.activeCases)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Aging Section */}
      <Card className="border-none shadow-md bg-white">
        <CardHeader>
          <CardTitle>Portfolio Aging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={isLoadingAging ? [] : agingData} 
                margin={{ top: 10, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="bracket" 
                  tick={{ fill: '#86888C' }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: '#86888C' }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#86888C' }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === "value") return [formatCurrency(value), "Total Value"];
                    return [formatNumber(value), "Number of Cases"];
                  }}
                  labelStyle={{ color: '#2A2B2E' }}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  yAxisId="left"
                  name="value"
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#ef4444"
                  strokeWidth={2}
                  yAxisId="right"
                  name="count"
                  dot={{ fill: '#ef4444' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <AddDebtorModal 
        isOpen={isAddDebtorOpen}
        onClose={() => setIsAddDebtorOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
