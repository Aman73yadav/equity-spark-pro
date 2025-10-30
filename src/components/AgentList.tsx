import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, Video, MessageSquare, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  rating: number;
  total_deals: number;
  active_listings: number;
  status: string;
}

const AgentList = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAgents = async () => {
      const { data } = await supabase
        .from('agents')
        .select('*')
        .order('rating', { ascending: false });
      
      if (data) setAgents(data);
    };

    fetchAgents();
  }, []);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
    toast({
      title: "Initiating Call",
      description: `Calling ${phone}...`,
    });
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleMessage = (phone: string) => {
    window.location.href = `sms:${phone}`;
    toast({
      title: "Opening Messages",
      description: "Starting conversation...",
    });
  };

  const handleVideo = () => {
    toast({
      title: "Video Call",
      description: "Video calling feature will be available soon!",
      variant: "default",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <Card 
          key={agent.id} 
          className="overflow-hidden border-none hover:scale-[1.02] transition-transform"
          style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.specialty}</p>
                </div>
              </div>
              <Badge 
                variant={agent.status === 'available' ? 'default' : 'secondary'}
                className={agent.status === 'available' ? 'bg-success' : ''}
              >
                {agent.status}
              </Badge>
            </div>

            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(agent.rating)
                      ? 'fill-warning text-warning'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium">{agent.rating}</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Deals</span>
                <span className="font-medium">{agent.total_deals}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Listings</span>
                <span className="font-medium">{agent.active_listings}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCall(agent.phone)}
                className="gap-2"
              >
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEmail(agent.email)}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleVideo}
                className="gap-2"
              >
                <Video className="h-4 w-4" />
                Video
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleMessage(agent.phone)}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AgentList;
