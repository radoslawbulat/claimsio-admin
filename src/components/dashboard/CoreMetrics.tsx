import { Card, CardContent } from "@/components/ui/card";
import { Timer, CircleCheck, Percent, Files } from "lucide-react";

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
      <Card className="border-none shadow-none">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[#FEF7CD]">
              <Timer className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-gray-900">
                {isLoading ? "Loading..." : error ? "Error" : formatCurrency(analytics?.portfolioValue || 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                In collection
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[#F2FCE2]">
              <CircleCheck className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-gray-900">
                {isLoading ? "Loading..." : error ? "Error" : formatCurrency(analytics?.recoveredValue || 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Recovered
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[#D3E4FD]">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-gray-900">
                {isLoading ? "Loading..." : error ? "Error" : `${analytics?.recoveryRate || 0}%`}
              </div>
              <div className="text-sm text-muted-foreground">
                Recovery Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[#E5DEFF]">
              <Files className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-gray-900">
                {isLoading ? "Loading..." : error ? "Error" : formatNumber(analytics?.activeCases || 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Cases
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
