
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddDebtorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDebtorModal = ({ isOpen, onClose }: AddDebtorModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Debtor added successfully");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[540px]">
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

            <div>
              <label htmlFor="amount" className="text-sm font-medium text-gray-700 block mb-1">
                Debt Amount ($)
              </label>
              <Input id="amount" type="number" min="0" step="0.01" placeholder="10000.00" required />
            </div>

            <div>
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 block mb-1">
                Due Date
              </label>
              <Input id="dueDate" type="date" required />
            </div>

            <div>
              <label htmlFor="notes" className="text-sm font-medium text-gray-700 block mb-1">
                Additional Notes
              </label>
              <Input id="notes" placeholder="Add any relevant notes..." />
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
      </SheetContent>
    </Sheet>
  );
};

export default AddDebtorModal;
