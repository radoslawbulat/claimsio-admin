
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

// Define color scheme for aging categories
const CHART_COLORS = {
  bars: ['#F9A902', '#FF5900', '#CA061A', '#5E007D', '#001747'],
  line: '#ef4444'
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

  const colorizedAgingData = agingData?.map((item, index) => ({
    ...item,
    fill: CHART_COLORS.bars[index % CHART_COLORS.bars.length]
  }));

  return (
    <div className="space-y-4 animate-fade-in bg-[#f9fafb] min-h-screen p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Performance</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Select portfolio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Portfolios</SelectItem>
              <SelectItem value="npl">NPL</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            size="sm"
            className="gap-1"
            onClick={() => setIsAddDebtorOpen(true)}
          >
            <PlusCircle size={16} />
            Add a debtor
          </Button>
        </div>
      </div>

      {/* Core Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium text-secondary">
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">
              {isLoading ? "Loading..." : error ? "Error" : formatCurrency(analytics.portfolioValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium text-secondary">
              Recovered Value
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">
              {isLoading ? "Loading..." : error ? "Error" : formatCurrency(analytics.recoveredValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium text-secondary">
              Recovery Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">
              {isLoading ? "Loading..." : error ? "Error" : `${analytics.recoveryRate}%`}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium text-secondary">
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">
              {isLoading ? "Loading..." : error ? "Error" : formatNumber(analytics.activeCases)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Aging Section */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Portfolio Aging</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={isLoadingAging ? [] : colorizedAgingData} 
                margin={{ top: 5, right: 20, left: 30, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="bracket" 
                  tick={{ fill: '#86888C', fontSize: 11 }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: '#86888C', fontSize: 11 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#86888C', fontSize: 11 }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === "value") return [formatCurrency(value), "Total Value"];
                    return [formatNumber(value), "Number of Cases"];
                  }}
                  labelStyle={{ color: '#2A2B2E', fontSize: 11 }}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: 11
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[3, 3, 0, 0]}
                  yAxisId="left"
                  name="value"
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={CHART_COLORS.line}
                  strokeWidth={1.5}
                  yAxisId="right"
                  name="count"
                  dot={{ fill: CHART_COLORS.line, r: 3 }}
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
