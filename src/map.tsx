import React, {useState,  useEffect, useRef, use} from 'react';
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

  const mapRef = useRef<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (loading) return;

    if (error) {
      console.error('카카오맵 로딩 실패', error);
      alert("카카오맵 로딩에 실패했습니다. 새로고침 해주세요.");
    return ;
    }

    console.log("카카오맵 로딩 완료");
    if (!navigator.geolocation) {
      alert("사용자의 위치 정보를 가져올 수 없습니다. 기본 위치로 설정됩니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log('현재 위치 좌표:', latitude, longitude);
        
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();

          geocoder.coord2Address(longitude, latitude, (result: any[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const region = result[0].address;
              if (region) {
                setAddress(region.address_name);
                const county = region.region_2depth_name;
                const city = region.region_1depth_name;
                const town = region.region_3depth_name;

                const regionAddress = county + city + town;
                
                geocoder.addressSearch(regionAddress, (res: any[], stat: string) => {
                  if (stat === window.kakao.maps.services.Status.OK) {
                    const cityCoordinate = res[0];
                    const lat = cityCoordinate.y;
                    const lng = cityCoordinate.x;
                    console.log('지역 좌표:', lat, lng);
                    setPosition({ lat, lng });
                  } else {
                    console.error('좌표를 찾지 못했습니다.', stat);
                  }
                });
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
  }, [loading]);
  
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        const center = mapRef.current.getCenter();
        mapRef.current.relayout();
        mapRef.current.setCenter(center);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


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
        onCreate={(map) => { mapRef.current = map; }}
      />
      <div style= {{marginTop: "0.75em"}}>
        <strong>현재 위치: </strong> {address}
      </div>
    </>
  );
};

export default MapComponent;