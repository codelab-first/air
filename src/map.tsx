import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';


const MapComponent = () => {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_API_KEY,
    libraries: ['services', 'clusterer'],
  }); // 추가 옵션에 대한 타입 (실제 옵션에 따라 조정)
  
  if (error) {
    return <div>지도 로딩 중 오류가 발생했습니다: {error.message}</div>;
  }

  if (loading) {
    return <div>지도 로딩 중...</div>;
  }

  return (
    // Map 내부에서 loading 상태를 관찰하고 있기 때문에 conditional rendering를 하지 않아도 됩니다.
    <Map
      center={{
        lat: import.meta.env.VITE_DEFAULT_LATITUDE, // 지도의 중심좌표 (위도)
        lng: import.meta.env.VITE_DEFAULT_LONGITUDE, // 지도의 중심좌표 (경도)
      }}
      style={{
        width: "50%", // 지도의 크기
        minWidth: "520px",
        height: "540px",
      }}
      level={9} // 지도의 확대 레벨
    />
  );
};

export default MapComponent;