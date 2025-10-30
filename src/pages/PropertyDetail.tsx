import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Heart, Share2, MapPin, Bed, Bath, Square, Phone, Mail, Video, MessageSquare, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  status: string;
  agent_id: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  rating: number;
}

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    if (!id) return;

    const { data: propertyData } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (propertyData) {
      setProperty(propertyData);

      if (propertyData.agent_id) {
        const { data: agentData } = await supabase
          .from('agents')
          .select('*')
          .eq('id', propertyData.agent_id)
          .single();
        
        if (agentData) setAgent(agentData);
      }
    }

    setLoading(false);
  };

  const handleContact = (type: string) => {
    if (!agent) return;

    switch (type) {
      case 'call':
        window.location.href = `tel:${agent.phone}`;
        break;
      case 'email':
        window.location.href = `mailto:${agent.email}`;
        break;
      case 'message':
        window.location.href = `sms:${agent.phone}`;
        break;
      case 'video':
        toast({
          title: "Video Call",
          description: "Video calling feature coming soon!",
        });
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Property not found</h2>
        <Button onClick={() => navigate('/properties')}>Back to Properties</Button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="h-96 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
              <Square className="h-32 w-32 text-primary/30" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-success text-lg px-4 py-2">{property.property_type}</Badge>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5" />
                  <span>{property.address}</span>
                </div>
                <p className="text-4xl font-bold text-primary">
                  ₹{(property.price / 100000).toFixed(2)} Lakhs
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 py-6 border-y">
                <div className="text-center">
                  <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.bedrooms}</p>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                </div>
                <div className="text-center">
                  <Bath className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.bathrooms}</p>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                </div>
                <div className="text-center">
                  <Square className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{property.square_feet}</p>
                  <p className="text-sm text-muted-foreground">Sq. Feet</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description || "Beautiful property with excellent features and modern amenities. Located in a prime area with great connectivity and surrounded by essential services."}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {agent && (
            <Card className="p-6 border-none sticky top-6" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}>
              <h3 className="text-lg font-bold mb-4">Contact Agent</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{agent.name}</h4>
                  <p className="text-sm text-muted-foreground">{agent.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-warning">★</span>
                    <span className="text-sm font-medium">{agent.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  onClick={() => handleContact('call')}
                >
                  <Phone className="h-4 w-4" />
                  Call Agent
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => handleContact('email')}
                >
                  <Mail className="h-4 w-4" />
                  Email Agent
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => handleContact('video')}
                    className="gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Video
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleContact('message')}
                    className="gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{agent.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-xs">{agent.email}</span>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6 border-none" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}>
            <h3 className="text-lg font-bold mb-4">Schedule a Viewing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Book an appointment to view this property
            </p>
            <Button className="w-full bg-gradient-to-r from-accent to-success hover:opacity-90">
              Schedule Tour
            </Button>
          </Card>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
