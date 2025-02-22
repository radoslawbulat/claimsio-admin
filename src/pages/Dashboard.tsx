
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, DollarSign } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-semibold">Today's Campaigns</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Total Calls
            </CardTitle>
            <Phone className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">531,686</div>
            <p className="text-xs text-success">+90% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Right Party Contacts
            </CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25,131</div>
            <p className="text-xs text-success">+60% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">
              Cash Collected
            </CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,756,221</div>
            <p className="text-xs text-success">+45% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <p className="text-sm text-secondary">Please find your campaigns below</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Scheduled Time</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4"># Agents</th>
                  <th className="text-left py-3 px-4">P90 Latency (s)</th>
                  <th className="text-left py-3 px-4">Complete %</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div>Early DQ</div>
                    <div className="text-sm text-secondary">Outbound</div>
                  </td>
                  <td className="py-3 px-4">8AM - 9PM</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-success text-white">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4">50</td>
                  <td className="py-3 px-4">2.3</td>
                  <td className="py-3 px-4">88%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
