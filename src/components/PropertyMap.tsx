import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  address: string;
}

const PropertyMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from('properties')
        .select('id, title, price, latitude, longitude, address')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (data) setProperties(data);
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTNhNWE2ejMwMDNqMnFyMGJodDN2MW9vIn0.RHdWJ-QAg2J32J-66gUBqQ';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.2090, 28.6139], // Delhi, India
      zoom: 4,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || properties.length === 0) return;

    properties.forEach((property) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.background = 'linear-gradient(135deg, hsl(217 91% 60%), hsl(195 85% 55%))';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="font-weight: 600; margin-bottom: 4px;">${property.title}</h3>
          <p style="color: hsl(217 91% 60%); font-weight: 600; margin-bottom: 4px;">₹${(property.price / 100000).toFixed(2)}L</p>
          <p style="font-size: 12px; color: #666;">${property.address}</p>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [properties]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border" style={{ boxShadow: 'var(--shadow-lg)' }}>
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
        <p className="text-sm font-medium">
          <span className="text-primary">{properties.length}</span> Properties Available
        </p>
      </div>
    </div>
  );
};

export default PropertyMap;
