
import { AlertTriangle } from "lucide-react";

interface CaseWarningBannerProps {
  message: string;
}

export const CaseWarningBanner = ({ message }: CaseWarningBannerProps) => {
  return (
    <div className="bg-[#FEF7CD] border-l-4 border-[#F97316] p-4 mb-6 flex items-center gap-3">
      <AlertTriangle className="text-[#F97316] h-6 w-6" />
      <p className="text-[#9A3412] text-base">{message}</p>
    </div>
  );
};
