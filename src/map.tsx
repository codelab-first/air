import React, { useState, useEffect, useRef, use } from "react"
import { Map, useKakaoLoader } from "react-kakao-maps-sdk"

import useCurrentLocation from "./Hook/useCurrentLocation"
import useMapBoundary from "./Hook/useMapBoundary"
import useMapResize from "./Hook/useMapResize"

import useKakaoApi from "./api/useKakaoApi"

const MapComponent = () => {
  const { loading: apiLoading, error: apiError } = useKakaoApi()
  const {
    position,
    address,
    loading: locationLoading,
    error: locationError,
  } = useCurrentLocation()
  const { bounds, updateBounds } = useMapBoundary()
  const { setMap } = useMapResize()

  if (apiLoading || locationLoading) return <div>로딩중...</div>
  if (apiError) return <div>카카오맵 API 로딩 실패: {apiError.message}</div>

  return (
    // Map 내부에서 loading 상태를 관찰하고 있기 때문에 conditional rendering를 하지 않아도 됩니다.
    <>
      <Map
        center={position}
        style={{
          width: "50%", // 지도의 크기
          minWidth: "480px",
          height: "480px",
        }}
        level={9} // 지도의 확대 레벨
        onCreate={(map) => {
          setMap(map)
          updateBounds(map)
          console.log("지도 생성 완료", map)
        }}
        onIdle={(map) => {
          updateBounds(map)
          console.log("지도 이동 완료", map)
        }}
      />
      <div style={{ marginTop: "0.75em" }}>
        <strong>현재 위치: </strong> {address}
      </div>
      {bounds && (
        <div style={{ marginTop: "1em" }}>
          <strong>지도 경계:</strong>
          <br />
          <ul>
            <div>
              남서쪽: {bounds.sw.lat}, {bounds.sw.lng}
            </div>
            <div>
              북동쪽: {bounds.ne.lat}, {bounds.ne.lng}
            </div>
          </ul>
        </div>
      )}
    </>
  )
}

export default MapComponent
