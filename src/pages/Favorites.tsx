import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);

  return (
    <Layout>
      <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          My Favorites
        </h1>
        <p className="text-muted-foreground">Properties you've saved for later</p>
      </div>

      {favorites.length === 0 ? (
        <Card className="p-12 text-center border-none" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}>
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Start exploring properties and save your favorites!
          </p>
          <Button 
            onClick={() => navigate('/properties')}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Browse Properties
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <Card 
              key={property.id}
              className="overflow-hidden border-none hover:scale-[1.02] transition-transform"
              style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}
            >
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                <p className="text-xl font-bold text-primary mb-4">
                  ₹{(property.price / 100000).toFixed(2)}L
                </p>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gap-2"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button 
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>
    </Layout>
  );
};

export default Favorites;
