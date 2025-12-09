import type { Provider } from "LoginProvider";

/** Kakao Provider 정의 */
export const KakaoOauthProvider: Provider = {
  name: 'Kakao',
  icon: '/oauthBtn/kakaotalk_sharing_btn_medium.png',
  api: '/api/oauth/kakao/login'
};

/**
 * OAuth 요청 시작 (API로 Kakao redirect URL 요청)
 */
export async function loginWithKakao() {
  try {
    const previousUrl = document.referrer || '/';
    localStorage.setItem('redirectAfterLogin', previousUrl);

    const res = await fetch(KakaoOauthProvider.api, {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) {
      console.error("OAuth 서버 요청 실패:", res.status, res.statusText);
      throw new Error("OAuth 요청 실패");
    }

    const data = await res.json();

    if (!data.url) {
      throw new Error("url 없음");
    }

    window.location.assign(data.url);

  } catch (err) {
    console.error("loginWithKakao error:", err);
    alert("로그인 중 문제가 발생했습니다.");
  }
}
