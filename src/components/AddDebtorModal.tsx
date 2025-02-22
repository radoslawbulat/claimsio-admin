
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

interface AddDebtorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
];

const AddDebtorModal = ({ isOpen, onClose }: AddDebtorModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Debtor added successfully", {
      duration: 3000,
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full h-full overflow-y-auto sm:max-w-[540px] p-0">
        <div className="p-6 h-full">
          <SheetHeader>
            <SheetTitle>Add a New Debtor</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">
                  Full Name
                </label>
                <Input id="name" placeholder="John Doe" required />
              </div>

              <div>
                <label htmlFor="nationality" className="text-sm font-medium text-gray-700 block mb-1">
                  Nationality
                </label>
                <Input id="nationality" placeholder="e.g. American" required />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
                  Email
                </label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1">
                  Phone Number
                </label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currency" className="text-sm font-medium text-gray-700 block mb-1">
                    Currency
                  </label>
                  <Select defaultValue="USD">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="amount" className="text-sm font-medium text-gray-700 block mb-1">
                    Debt Amount
                  </label>
                  <Input id="amount" type="number" min="0" step="0.01" placeholder="10000.00" required />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-1">
                  Description
                </label>
                <Textarea 
                  id="description" 
                  placeholder="Enter details about the debt..." 
                  className="resize-none" 
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="attachments" className="text-sm font-medium text-gray-700 block mb-1">
                  Attachments
                </label>
                <div className="mt-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-8 w-8 text-gray-400" />
                      <div className="mt-2 text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer text-blue-600 hover:text-blue-500">
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                        </label>
                        <span className="pl-1">or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Debtor
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddDebtorModal;

