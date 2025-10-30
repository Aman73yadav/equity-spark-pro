import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Building, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, MessageSquare, Heart } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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
        {children}
      </main>
    </div>
  );
};

export default Layout;
