
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface RecoveryTrendsProps {
  isLoading: boolean;
  data: { month: string; amount: number }[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  return new Date(+year, +month - 1).toLocaleDateString('pl-PL', { month: 'short', year: 'numeric' });
};

export const RecoveryTrends = ({ isLoading, data }: RecoveryTrendsProps) => {
  return (
    <Card className="border-none bg-white w-full">
      <CardHeader>
        <CardTitle>Recovery Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={isLoading ? [] : data}
              margin={{ top: 10, right: 30, left: 40, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tickFormatter={formatDate}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={formatDate}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#2563EB"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
