import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, PhoneCall, Mail, ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { getCommsStatusColor } from "@/utils/case-colors";
import { Communication } from "@/types/case";
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [directionFilter, setDirectionFilter] = useState<'all' | 'inbound' | 'outbound'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'call' | 'email' | 'sms'>('all');

  const filteredComms = communications.filter(comm => {
    const matchesDirection = directionFilter === 'all' ? true : comm.direction === directionFilter;
    const matchesType = typeFilter === 'all' ? true : comm.comms_type === typeFilter;
    return matchesDirection && matchesType;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity</CardTitle>
          <div className="flex gap-4">
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="call">Calls</SelectItem>
                <SelectItem value="email">Emails</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
            <Select value={directionFilter} onValueChange={(value: any) => setDirectionFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Directions</SelectItem>
                <SelectItem value="inbound">
                  <div className="flex items-center gap-2">
                    <ArrowLeftFromLine className="h-3 w-3" />
                    Inbound
                  </div>
                </SelectItem>
                <SelectItem value="outbound">
                  <div className="flex items-center gap-2">
                    <ArrowRightFromLine className="h-3 w-3" />
                    Outbound
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredComms && filteredComms.length > 0 ? (
          <div className="space-y-4">
            {filteredComms.map((comm) => (
              <div key={comm.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent">
                  {getCommsIcon(comm.comms_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{comm.comms_type}</span>
                      <Badge className={getCommsStatusColor(comm.status)}>
                        {comm.status}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {comm.direction === 'inbound' ? (
                          <ArrowLeftFromLine className="h-3 w-3" />
                        ) : (
                          <ArrowRightFromLine className="h-3 w-3" />
                        )}
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
