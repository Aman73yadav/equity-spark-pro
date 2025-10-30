import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Auth from "@/components/Auth";
import Dashboard from "@/components/Dashboard";
import PropertyMap from "@/components/PropertyMap";
import AgentList from "@/components/AgentList";
import AIAssistant from "@/components/AIAssistant";
import NotificationCenter from "@/components/NotificationCenter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Map, Users, Bot, Bell, Building, Heart, MessageSquare, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Dream Equity Portal
                </h1>
                <p className="text-xs text-muted-foreground">Premium Real Estate Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/profile')}
                className="gap-2"
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="border-b bg-background sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto py-2">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 shrink-0">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/properties')} className="gap-2 shrink-0">
              <Building className="h-4 w-4" />
              Properties
            </Button>
            <Button variant="ghost" onClick={() => navigate('/messages')} className="gap-2 shrink-0">
              <MessageSquare className="h-4 w-4" />
              Messages
            </Button>
            <Button variant="ghost" onClick={() => navigate('/favorites')} className="gap-2 shrink-0">
              <Heart className="h-4 w-4" />
              Favorites
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" />
              Map
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2">
              <Users className="h-4 w-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Bot className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
              <p className="text-muted-foreground">Overview of your real estate portfolio</p>
            </div>
            <Dashboard />
          </TabsContent>

          <TabsContent value="map" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Property Map</h2>
              <p className="text-muted-foreground">Explore properties across India</p>
            </div>
            <PropertyMap />
          </TabsContent>

          <TabsContent value="agents" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Our Agents</h2>
              <p className="text-muted-foreground">Connect with top real estate professionals</p>
            </div>
            <AgentList />
          </TabsContent>

          <TabsContent value="ai" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">AI Assistant</h2>
              <p className="text-muted-foreground">Get instant answers to your real estate questions</p>
            </div>
            <AIAssistant />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Notifications</h2>
              <p className="text-muted-foreground">Stay updated with the latest activities</p>
            </div>
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
