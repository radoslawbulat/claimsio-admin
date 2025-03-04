
import React from 'react';
import { FileText, Download } from "lucide-react";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { CaseAttachment } from "@/types/case";

interface CaseDocumentsProps {
  documents: CaseAttachment[];
}

export const CaseDocuments = ({ documents }: CaseDocumentsProps) => {
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
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
