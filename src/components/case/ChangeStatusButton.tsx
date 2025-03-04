
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChangeStatusButtonProps {
  caseId: string;
  currentStatus: "ACTIVE" | "CLOSED" | "SUSPENDED" | "CANCELLED";
}

export function ChangeStatusButton({ caseId, currentStatus }: ChangeStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<typeof currentStatus>(currentStatus);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = async () => {
    try {
      const { error } = await supabase
        .from('cases')
        .update({ status })
        .eq('id', caseId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Case status has been changed to ${status.toLowerCase()}`,
      });

      // Invalidate the case query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update case status",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Case Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={status}
            onValueChange={(value: typeof currentStatus) => setStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleStatusChange}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
