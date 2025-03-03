import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CoreMetricsProps {
  isLoading: boolean;
  error: Error | null;
  analytics: {
    portfolioValue: number;
    recoveredValue: number;
    recoveryRate: number;
    activeCases: number;
  } | undefined;
}

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

export const CoreMetrics = ({ isLoading, error, analytics }: CoreMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-none bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-secondary">
            In collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : error ? "Error" : formatCurrency(analytics?.portfolioValue || 0)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-secondary">
            Recovered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : error ? "Error" : formatCurrency(analytics?.recoveredValue || 0)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-secondary">
            Recovery Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : error ? "Error" : `${analytics?.recoveryRate || 0}%`}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-secondary">
            Active Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : error ? "Error" : formatNumber(analytics?.activeCases || 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
