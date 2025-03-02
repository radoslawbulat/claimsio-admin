import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, PhoneCall, Mail } from "lucide-react";
import { getCommsStatusColor } from "@/utils/case-colors";
import { Communication } from "@/types/case";

const getCommsIcon = (type: Communication['comms_type']) => {
  switch (type) {
    case 'call':
      return <PhoneCall className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'sms':
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <MessageCircle className="h-4 w-4" />;
  }
};

interface CaseActivityProps {
  communications: Communication[];
}

export const CaseActivity = ({ communications }: CaseActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {communications && communications.length > 0 ? (
          <div className="space-y-4">
            {communications.map((comm) => (
              <div key={comm.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="p-2 bg-secondary rounded-full">
                  {getCommsIcon(comm.comms_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{comm.comms_type}</span>
                      <Badge className={getCommsStatusColor(comm.status)}>
                        {comm.status}
                      </Badge>
                      <Badge variant="outline">
                        {comm.direction}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(comm.created_at), 'PPpp')}
                    </span>
                  </div>
                  {comm.content && (
                    <p className="text-sm text-muted-foreground">{comm.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No communications recorded for this case
          </div>
        )}
      </CardContent>
    </Card>
  );
};
