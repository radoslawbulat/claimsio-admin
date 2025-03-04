import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlyRecoveryData {
  month: string;
  recovered: number;
  value: number;
}

interface MonthlyRecoveryChartProps {
  isLoading: boolean;
  data: MonthlyRecoveryData[];
}

const CHART_COLORS = {
  bars: '#60A5FA',
  line: '#2563EB'
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

export const MonthlyRecoveryChart = ({ isLoading, data }: MonthlyRecoveryChartProps) => {
  if (isLoading) {
    return (
      <Card className="border-none bg-white w-full">
        <CardHeader>
          <CardTitle>Monthly Recoveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-white w-full">
      <CardHeader>
        <CardTitle>Monthly Recoveries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={data} 
              margin={{ top: 10, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const value = payload.find(p => p.name === "value")?.value as number;
                    const recovered = payload.find(p => p.name === "recovered")?.value as number;
                    
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                        <p className="text-gray-900 font-medium mb-1">{label}</p>
                        <p className="text-gray-700">
                          Total Recovery Amount: <span className="font-semibold">{formatCurrency(value)}</span>
                        </p>
                        <p className="text-gray-700">
                          Number of Cases: <span className="font-semibold">{formatNumber(recovered)}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                fill={CHART_COLORS.bars} 
                yAxisId="left"
                radius={[4, 4, 0, 0]}
                name="value"
              />
              <Line
                type="monotone"
                dataKey="recovered"
                stroke={CHART_COLORS.line}
                strokeWidth={2}
                yAxisId="right"
                name="recovered"
                dot={{ fill: CHART_COLORS.line, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
