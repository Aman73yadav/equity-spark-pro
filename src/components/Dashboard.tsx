import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, TrendingUp, MapPin } from "lucide-react";

interface Stats {
  totalProperties: number;
  totalAgents: number;
  avgPrice: number;
  activeListings: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    totalAgents: 0,
    avgPrice: 0,
    activeListings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: properties } = await supabase.from('properties').select('price, status');
      const { data: agents } = await supabase.from('agents').select('active_listings');

      if (properties && agents) {
        const active = properties.filter(p => p.status === 'available').length;
        const avgPrice = properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length;
        const totalListings = agents.reduce((sum, a) => sum + (a.active_listings || 0), 0);

        setStats({
          totalProperties: properties.length,
          totalAgents: agents.length,
          avgPrice,
          activeListings: totalListings,
        });
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      gradient: "from-primary to-primary-glow",
    },
    {
      title: "Active Agents",
      value: stats.totalAgents,
      icon: Users,
      gradient: "from-accent to-success",
    },
    {
      title: "Avg Property Value",
      value: `₹${(stats.avgPrice / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      gradient: "from-warning to-destructive",
    },
    {
      title: "Active Listings",
      value: stats.activeListings,
      icon: MapPin,
      gradient: "from-primary to-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden border-none"
          style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {stat.value}
            </p>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mb-16 -mr-16" />
        </Card>
      ))}
    </div>
  );
};

export default Dashboard;
