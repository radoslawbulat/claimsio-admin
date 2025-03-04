
import { format } from 'date-fns';
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquarePlus, User } from "lucide-react";
import { getCommsStatusColor, getCommsTypeColor } from "@/utils/case-colors";
import { Communication } from "@/types/case";
import { AddMessageModal } from "./AddMessageModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CaseActivityProps {
  communications: Communication[];
}

export const CaseActivity = ({ communications }: CaseActivityProps) => {
  const [isAddMessageOpen, setIsAddMessageOpen] = useState(false);
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
          <CardTitle>Communication History</CardTitle>
          <div className="flex items-center gap-4">
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
                <SelectItem value="inbound">Inbound</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsAddMessageOpen(true)}
            >
              <MessageSquarePlus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredComms && filteredComms.length > 0 ? (
          <div className="space-y-4">
            {filteredComms.map((comm) => (
              <div 
                key={comm.id} 
                className={`flex items-start gap-4 p-4 rounded-lg ${
                  comm.direction === 'inbound' ? '' : 'flex-row-reverse'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  comm.direction === 'inbound' ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                  {comm.direction === 'inbound' ? (
                    <User className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Bot className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className={`flex-1 ${comm.direction === 'outbound' ? 'text-right' : ''}`}>
                  <div className={`flex items-center justify-between mb-2 ${
                    comm.direction === 'outbound' ? 'flex-row-reverse' : ''
                  }`}>
                    <div className={`flex items-center gap-2 ${
                      comm.direction === 'outbound' ? 'flex-row-reverse' : ''
                    }`}>
                      <span className="font-medium">
                        {comm.direction === 'inbound' ? 'Customer' : 'System'}
                      </span>
                      <Badge className={getCommsTypeColor(comm.comms_type)}>
                        {comm.comms_type}
                      </Badge>
                      <Badge className={getCommsStatusColor(comm.status)}>
                        {comm.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(comm.created_at), 'MMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                  {comm.content && (
                    <div className={`p-3 rounded-lg ${
                      comm.direction === 'inbound' 
                        ? 'bg-blue-50 mr-auto' 
                        : 'bg-gray-50 ml-auto'
                    } max-w-[80%]`}>
                      <p className="text-sm">{comm.content}</p>
                    </div>
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
      <AddMessageModal 
        isOpen={isAddMessageOpen}
        onClose={() => setIsAddMessageOpen(false)}
      />
    </Card>
  );
};

