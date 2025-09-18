import { useState } from "react";

interface BoundaryState {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}

export default function useMapBoundary() {
  const [bounds, setBounds] = useState<BoundaryState | null>(null);

  const isBoundEqual = (
    prevBound: BoundaryState | null,
    newBound: BoundaryState | null
  ) => {
    if (!prevBound || !newBound) return false;
    return (
      prevBound.sw.lat === newBound.sw.lat &&
      prevBound.sw.lng === newBound.sw.lng &&
      prevBound.ne.lat === newBound.ne.lat &&
      prevBound.ne.lng === newBound.ne.lng
    );
  };

  const updateBounds = (map: kakao.maps.Map) => {
    const kakaoBounds = map.getBounds();
    if (!kakaoBounds) return;
    const sw = kakaoBounds.getSouthWest();
    const ne = kakaoBounds.getNorthEast();
    const newBounds = {
      sw: { lat: sw.getLat(), lng: sw.getLng() },
      ne: { lat: ne.getLat(), lng: ne.getLng() },
    };

    if (!isBoundEqual(bounds, newBounds)) {
      setBounds(newBounds);
    }
  };

  return { bounds, updateBounds };
}