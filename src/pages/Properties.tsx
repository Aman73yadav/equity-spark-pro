import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Search, Heart, MapPin, Bed, Bath, Square, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  status: string;
  image_url: string;
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [searchQuery, priceRange, propertyType, properties]);

  const fetchProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });
    
    if (data) {
      setProperties(data);
      setFilteredProperties(data);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter(p => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    if (propertyType !== "all") {
      filtered = filtered.filter(p => p.property_type === propertyType);
    }

    setFilteredProperties(filtered);
  };

  const handleFavorite = async (propertyId: string) => {
    toast({
      title: "Added to Favorites",
      description: "Property saved to your favorites list",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Browse Properties
        </h1>
        <p className="text-muted-foreground">Discover your dream property from our extensive collection</p>
      </div>

      {/* Filters */}
      <Card className="p-6 border-none" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-500000">Under ₹5L</SelectItem>
              <SelectItem value="500000-1000000">₹5L - ₹10L</SelectItem>
              <SelectItem value="1000000-2000000">₹10L - ₹20L</SelectItem>
              <SelectItem value="2000000-0">Above ₹20L</SelectItem>
            </SelectContent>
          </Select>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{filteredProperties.length} properties found</span>
        </div>
      </Card>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card 
            key={property.id}
            className="overflow-hidden border-none hover:scale-[1.02] transition-transform cursor-pointer group"
            style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}
            onClick={() => navigate(`/property/${property.id}`)}
          >
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Square className="h-16 w-16 text-primary/30" />
              </div>
              <div className="absolute top-3 right-3 z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(property.id);
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-success">{property.property_type}</Badge>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-3">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <p className="text-2xl font-bold text-primary">
                  ₹{(property.price / 100000).toFixed(2)}L
                </p>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{property.address}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{property.bathrooms}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{property.square_feet}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="p-12 text-center border-none" style={{ background: 'var(--gradient-card)' }}>
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No properties found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters</p>
        </Card>
      )}
      </div>
    </Layout>
  );
};

export default Properties;
