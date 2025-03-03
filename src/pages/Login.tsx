
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to login",
      });
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/50">
      <div className="w-full max-w-sm p-3 animate-fade-in">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-0.5 flex flex-col items-center py-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Debt Collector Access
            </CardTitle>
            <p className="text-[#8E9196] text-sm">
              Please login to access your account
            </p>
          </CardHeader>
          <CardContent className="pb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 text-sm placeholder:text-[#8E9196] focus:border-primary"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  placeholder="Email"
                />
              </div>
              <div className="space-y-1.5">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-9 text-sm placeholder:text-[#8E9196] focus:border-primary"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  placeholder="Password"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-9 text-sm bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
