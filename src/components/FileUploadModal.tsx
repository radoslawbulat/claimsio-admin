
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUpload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileUploadModal = ({ isOpen, onClose }: FileUploadModalProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      await handleFileUpload(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please upload a CSV file",
      });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // TODO: Implement file upload logic here
    toast({
      title: "File uploaded",
      description: `Successfully uploaded ${file.name}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload CSV File</DialogTitle>
        </DialogHeader>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            mt-4 border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center gap-4
            cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-input'}
          `}
        >
          <FileUpload className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Drag and drop your CSV file here, or{" "}
              <label className="text-primary hover:underline cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileSelect}
                />
              </label>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
