import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, ComposedChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line } from "recharts";

interface PortfolioAgingProps {
  isLoading: boolean;
  data: any[];
}

const CHART_COLORS = {
  bars: ['#60A5FA', '#34D399', '#FBBF24', '#FB923C', '#F87171'],
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

export const PortfolioAging = ({ isLoading, data }: PortfolioAgingProps) => {
  const colorizedData = data?.map((item, index) => ({
    ...item,
    fill: CHART_COLORS.bars[index % CHART_COLORS.bars.length]
  }));

  return (
    <Card className="border border-input bg-white">
      <CardHeader>
        <h2 className="text-xl font-semibold mb-4">Collection Age</h2>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={isLoading ? [] : colorizedData} 
              margin={{ top: 10, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="bracket" 
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
                hide={true}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === "value") return [formatCurrency(value), "Total Value"];
                  return [formatNumber(value), "Number of Cases"];
                }}
                labelStyle={{ color: '#374151', fontWeight: 500 }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                yAxisId="left"
                name="value"
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={CHART_COLORS.line}
                strokeWidth={2}
                yAxisId="right"
                name="count"
                dot={{ fill: CHART_COLORS.line, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
