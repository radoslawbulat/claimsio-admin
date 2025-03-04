
import React from 'react';
import { FileText, Download, Eye } from "lucide-react";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { CaseAttachment } from "@/types/case";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CaseDocumentsProps {
  documents: CaseAttachment[];
}

export const CaseDocuments = ({ documents }: CaseDocumentsProps) => {
  const { toast } = useToast();

  const handleDownload = async (doc: CaseAttachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('case-attachments')
        .download(doc.storage_path);

      if (error) {
        throw error;
      }

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.file_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error downloading the file. Please try again."
      });
    }
  };

  const handlePreview = async (doc: CaseAttachment) => {
    try {
      const { data: { publicUrl }, error } = await supabase.storage
        .from('case-attachments')
        .getPublicUrl(doc.storage_path);

      if (error) {
        throw error;
      }

      // Open preview in new tab
      window.open(publicUrl, '_blank');

    } catch (error) {
      console.error('Error previewing file:', error);
      toast({
        variant: "destructive",
        title: "Preview failed",
        description: "There was an error previewing the file. Please try again."
      });
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No documents attached to this case
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Case Documents</h3>
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-muted-foreground" size={20} />
              <div>
                <div className="font-medium">{doc.file_name}</div>
                <div className="text-sm text-muted-foreground">
                  {doc.description || 'No description'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Added {format(new Date(doc.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePreview(doc)}
              >
                <Eye size={16} className="mr-2" />
                Preview
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownload(doc)}
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
