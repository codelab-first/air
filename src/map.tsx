import React, {useState,  useEffect} from 'react';
import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';


const MapComponent = () => {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_API_KEY,
    libraries: ['services', 'clusterer'],
  });
  
  const [position, setPosition] = useState({
    lat: import.meta.env.VITE_DEFAULT_LATITUDE,
    lng: import.meta.env.VITE_DEFAULT_LONGITUDE,
  });

  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("사용자의 위치 정보를 가져올 수 없습니다. 기본 위치로 설정됩니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();

          geocoder.coord2Address(longitude, latitude, (result: any[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const region = result.find((r) => r.region_type === 'H' || r.region_type === 'B');
              if (region) {
                setPosition({ lat: latitude, lng: longitude });
                setAddress(region.address_name);
                console.log('현재 위치 주소:', region.address_name);
              }
            }
          });
        } else {
          console.error('카카오맵 API가 로드되지 않았습니다.');
        }
      },
      (err) => {
        console.error('위치 정보를 가져올 수 없습니다.', err);
      }
    );
  }, []);

  if (loading) {
    return <div>지도 로딩 중...</div>;
  }

  if (error) {
    return <div>지도 로딩 중 오류가 발생했습니다: {error.message}</div>;
  }


  return (
    // Map 내부에서 loading 상태를 관찰하고 있기 때문에 conditional rendering를 하지 않아도 됩니다.
    
    <>
      <Map
        center={position}
        style={{
          width: "50%", // 지도의 크기
          minWidth: "520px",
          height: "540px",
        }}
        level={9} // 지도의 확대 레벨
      />
      <div style= {{marginTop: "0.75em"}}>
        <strong>현재 위치: </strong> {address}
      </div>
    </>
  );
};

export default MapComponent;