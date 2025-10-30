import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Save, Camera } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) setProfile(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
      })
      .eq('id', profile.id);

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card className="p-8 border-none" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-5xl">
              {profile.full_name?.charAt(0) || 'U'}
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-10 w-10"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-2xl font-bold mt-4">{profile.full_name || 'User'}</h2>
          <p className="text-muted-foreground">{profile.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="fullName"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+91 1234567890"
            />
          </div>

          <Button
            type="submit"
            className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>

      <Card className="p-6 border-none" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}>
        <h3 className="text-lg font-bold mb-4">Account Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Saved Properties</p>
            <p className="text-2xl font-bold text-primary">0</p>
          </div>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Property Views</p>
            <p className="text-2xl font-bold text-accent">0</p>
          </div>
        </div>
      </Card>
      </div>
    </Layout>
  );
};

export default Profile;
