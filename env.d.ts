interface ImportMetaEnv {
  readonly VITE_KAKAO_API_KEY: string;
  readonly VITE_DEFAULT_LATITUDE: number;
  readonly VITE_DEFAULT_LONGITUDE: number;
  // 다른 환경 변수들도 여기에 추가할 수 있습니다.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}