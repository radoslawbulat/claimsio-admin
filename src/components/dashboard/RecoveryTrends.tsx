
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface RecoveryTrendsProps {
  isLoading: boolean;
  data: { 
    month: string; 
    low: number;
    medium: number;
    high: number;
    critical: number;
  }[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const RecoveryTrends = ({ isLoading, data }: RecoveryTrendsProps) => {
  return (
    <Card className="border-none bg-white w-full">
      <CardHeader>
        <CardTitle>Cumulative Recovery Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={isLoading ? [] : data}
              margin={{ top: 10, right: 30, left: 40, bottom: 20 }}
              stackOffset="none"
            >
              <defs>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }}
              />
              <Area
                type="monotone"
                dataKey="critical"
                stackId="1"
                stroke="#8B5CF6"
                fill="url(#colorCritical)"
              />
              <Area
                type="monotone"
                dataKey="high"
                stackId="1"
                stroke="#3B82F6"
                fill="url(#colorHigh)"
              />
              <Area
                type="monotone"
                dataKey="medium"
                stackId="1"
                stroke="#FBBF24"
                fill="url(#colorMedium)"
              />
              <Area
                type="monotone"
                dataKey="low"
                stackId="1"
                stroke="#10B981"
                fill="url(#colorLow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
