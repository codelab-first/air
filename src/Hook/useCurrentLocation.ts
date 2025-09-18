import { useState, useEffect, use } from "react";
import useKakaoApi from "../api/useKakaoApi";

interface LocationState {
  position : { lat: number; lng: number };
  address: string;
  loading: boolean;
  error: string | null;
}

const DEFAULT_POSITION = {
  lat: import.meta.env.VITE_DEFAULT_LATITUDE,
  lng: import.meta.env.VITE_DEFAULT_LONGITUDE,
}

export default function useCurrentLocation(): LocationState {
  const { loading: apiLoading, error: apiError } = useKakaoApi();
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (apiLoading) {
      setLoading(false);
      setError("카카오맵 API 로딩 중...");
      return;
    }
    if (apiError) {
      console.error("카카오맵 로딩 실패", apiError);
      setLoading(false);
      setError("카카오맵 로딩에 실패했습니다.");
      return;
    }

    if (!navigator.geolocation) {
      setLoading(false);
      setError("사용자의 위치 정보를 가져올 수 없습니다. 기본 위치로 설정됩니다.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("현재 위치 좌표:", latitude, longitude);
        
        // 좌표를 주소로 변환
        if (window.kakao && window.kakao.maps.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const region = result[0].address;
              if (region) {
                setAddress(region.address_name);
                const { region_1depth_name: city, region_2depth_name: district, region_3depth_name: town } = region;
                const regionAddress = `${city} ${district} ${town}`;

                // 읍면동주소를 좌표로 변환
                geocoder.addressSearch(regionAddress, (res: any, stat: string) => {
                  if (stat === window.kakao.maps.services.Status.OK) {
                    const cityCoordinate = res[0];
                    const {y: cityLat, x: cityLng} = cityCoordinate;
                    console.log("지역 좌표:", cityLat, cityLng);
                    setPosition({ lat: cityLat, lng: cityLng });
                  } else {
                  setError("지역 좌표를 찾지 못했습니다.");
                  }
                  setLoading(false);
              });
              } else {
                setError("주소를 찾지 못했습니다.");
                setLoading(false);
              }
            }
          });
        } else {
          setError("카카오맵 API가 로드되지 않았습니다.");
          setLoading(false);
        }
      },
      (err) => {
        setError("위치 정보를 가져올 수 없습니다: " + err.message);
        setLoading(false);
      }
    );
  }, [apiLoading, apiError]);

  return { position, address, loading, error };
}