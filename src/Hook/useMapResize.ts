import { useState, useEffect } from "react";

export default function useMapResize() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (!map) return;

    const center = map.getCenter();

    const handleResize = () => {
      map.relayout();
      map.setCenter(center);
    }; 

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return { setMap };
}
