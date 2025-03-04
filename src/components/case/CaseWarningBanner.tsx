
import { AlertTriangle } from "lucide-react";

interface CaseWarningBannerProps {
  message: string;
  disputeReason?: string;
}

export const CaseWarningBanner = ({ message, disputeReason }: CaseWarningBannerProps) => {
  const formattedReason = disputeReason?.charAt(0).toUpperCase() + disputeReason?.slice(1).toLowerCase();
  
  return (
    <div className="bg-[#FEF7CD] border-l-4 border-[#F97316] p-4 mb-6 flex items-center gap-3">
      <AlertTriangle className="text-[#F97316] h-6 w-6" />
      <div className="text-[#9A3412]">
        <p className="text-base">{message}</p>
        {disputeReason && (
          <p className="text-sm mt-1">
            Disputed reason: <span className="font-bold">{formattedReason}</span>
          </p>
        )}
      </div>
    </div>
  );
};
