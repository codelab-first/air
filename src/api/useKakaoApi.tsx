import { useKakaoLoader } from "react-kakao-maps-sdk"

export default function useKakaoApi() {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_API_KEY,
    libraries: ["services", "clusterer"],
  })

  return { loading, error }
}
