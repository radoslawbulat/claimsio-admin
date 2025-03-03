
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, ComposedChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line } from "recharts";

interface PortfolioAgingProps {
  isLoading: boolean;
  data: any[];
}

const CHART_COLORS = {
  bars: ['#F9A902', '#FF5900', '#CA061A', '#5E007D', '#001747'],
  line: '#ef4444'
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
    <Card className="border-none shadow-md bg-white">
      <CardHeader>
        <CardTitle>Portfolio Aging</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={isLoading ? [] : colorizedData} 
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
                dot={{ fill: CHART_COLORS.line }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
