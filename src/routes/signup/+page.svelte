<script lang="ts">
  import { goto } from '$app/navigation';

  let nickname = "";
  let bio = "";
  let profileImage: File | null = null;
  let previewUrl: string | null = null;

  let nicknameMessage = "";
  let isNicknameValid = false;

  const nicknameRegex = /^[a-zA-Z][a-zA-Z0-9_]{1,14}$/;

  async function checkNickname() {
    if (!nicknameRegex.test(nickname)) {
      nicknameMessage = "닉네임은 영어로 시작, 알파벳/숫자/_만 허용, 2~15글자여야 합니다.";
      isNicknameValid = false;
      return;
    }

    try {
      const res = await fetch(`/api/nicknames/available?nickname=${encodeURIComponent(nickname)}`);
      const data = await res.json();
      if (res.ok && data.available) {
        nicknameMessage = "✅ 사용 가능한 닉네임이에요.";
        isNicknameValid = true;
      } else {
        nicknameMessage = "❌ 이미 사용 중인 닉네임이에요.";
        isNicknameValid = false;
      }
    } catch {
      nicknameMessage = "서버 오류가 발생했어요.";
      isNicknameValid = false;
    }
  }

  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      profileImage = target.files[0];
      previewUrl = URL.createObjectURL(profileImage);
    }
  }

  function triggerFileInput() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  }

  async function handleSubmit() {
    if (!isNicknameValid) {
      alert("닉네임 중복 확인을 완료해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("bio", bio);
    if (profileImage) formData.append("profile_image", profileImage);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        if (data.redirect) window.location.href = data.redirect;
      } else {
        alert("회원가입 실패: " + (data.error || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error(err);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  }
</script>

<div class="container">
  <!-- 배경 행성 장식 -->
  <div class="bg-planet planet-1"></div>
  <div class="bg-planet planet-2"></div>
  <div class="bg-planet planet-3"></div>
  
  <div class="content-wrapper">
    <!-- 로고 섹션 -->
    <div class="logo-section">
      <div class="logo-circle">
        <span class="logo-emoji">🪐</span>
      </div>
      <h1 class="logo-text">Planet</h1>
      <p class="tagline">당신의 계획이 모여 하나의 행성이 됩니다</p>
    </div>

    <!-- 회원가입 카드 -->
    <div class="signup-card">
      <h2 class="card-title">회원가입</h2>
      
      <p class="intro">
        오늘의 할 일을 기록하고,<br/>
        목표를 달성하며 친구들과 공유하세요 🌟
      </p>

      <form on:submit|preventDefault={handleSubmit}>
        <!-- 프로필 이미지 -->
        <div class="profile-section">
          <div class="preview">
            {#if previewUrl}
              <img src={previewUrl} alt="프로필 미리보기" />
            {:else}
              <span class="placeholder-text">🪐</span>
            {/if}
          </div>
          <input 
            id="fileInput" 
            type="file" 
            accept="image/*" 
            on:change={handleImageUpload} 
            style="display:none" 
          />
          <button type="button" class="image-btn" on:click={triggerFileInput}>
            이미지 선택
          </button>
        </div>

        <!-- 닉네임 -->
        <div class="form-group">
          <label>닉네임</label>
          <div class="nickname-check">
            <input 
              type="text" 
              bind:value={nickname} 
              placeholder="영문 시작, 2~15글자"
              class="input-field"
            />
            <button type="button" class="check-btn" on:click={checkNickname}>
              중복 확인
            </button>
          </div>
          {#if nicknameMessage}
            <p class="nickname-message" class:valid={isNicknameValid}>
              {nicknameMessage}
            </p>
          {/if}
        </div>

        <!-- 자기소개 -->
        <div class="form-group">
          <label>자기소개</label>
          <textarea 
            bind:value={bio} 
            rows="3" 
            placeholder="간단한 자기소개를 입력해주세요"
            class="textarea-field"
          ></textarea>
        </div>

        <!-- 가입 버튼 -->
        <button type="submit" class="submit-btn">
          가입하기 🚀
        </button>
      </form>
    </div>

    <!-- 하단 안내 문구 -->
    <div class="footer-text">
      <p>Planet에 가입하면 서비스 약관 및 개인정보 보호정책에</p>
      <p>동의하게 됩니다.</p>
    </div>
  </div>
</div>

<style>
  .container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    background: linear-gradient(to bottom, #E8F3F1, #F0F0FF);
  }

  /* 배경 행성 장식 */
  .bg-planet {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .planet-1 {
    top: 5rem;
    right: 2.5rem;
    width: 10rem;
    height: 10rem;
    background: rgba(125, 189, 182, 0.2);
    filter: blur(60px);
  }

  .planet-2 {
    bottom: 5rem;
    left: 2.5rem;
    width: 15rem;
    height: 15rem;
    background: rgba(139, 157, 195, 0.2);
    filter: blur(60px);
  }

  .planet-3 {
    top: 50%;
    left: 25%;
    width: 8rem;
    height: 8rem;
    background: rgba(184, 164, 201, 0.15);
    filter: blur(40px);
  }

  .content-wrapper {
    width: 100%;
    max-width: 28rem;
    position: relative;
    z-index: 10;
  }

  /* 로고 섹션 */
  .logo-section {
    text-align: center;
    margin-bottom: 2rem;
  }

  .logo-circle {
    display: inline-block;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #7DBDB6, #8B9DC3);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 60px rgba(125, 189, 182, 0.3);
    margin-bottom: 1rem;
  }

  .logo-emoji {
    font-size: 3rem;
  }

  .logo-text {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #7DBDB6, #8B9DC3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tagline {
    color: #6B7280;
    font-size: 0.875rem;
  }

  /* 회원가입 카드 */
  .signup-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(125, 189, 182, 0.2);
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #111827;
    text-align: center;
    margin-bottom: 1rem;
  }

  .intro {
    text-align: center;
    color: #6B7280;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  /* 프로필 이미지 섹션 */
  .profile-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .preview {
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    border: 2px dashed rgba(125, 189, 182, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(125, 189, 182, 0.05), rgba(139, 157, 195, 0.05));
  }

  .preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-text {
    font-size: 2rem;
  }

  .image-btn {
    padding: 0.5rem 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(125, 189, 182, 0.3);
    background: white;
    color: #7DBDB6;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .image-btn:hover {
    background: rgba(125, 189, 182, 0.1);
    border-color: #7DBDB6;
  }

  /* 폼 그룹 */
  .form-group {
    margin-bottom: 1.25rem;
  }

  label {
    display: block;
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .input-field, .textarea-field {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #E5E7EB;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .input-field:focus, .textarea-field:focus {
    border-color: #7DBDB6;
  }

  .textarea-field {
    min-height: 80px;
    max-height: 150px;
    resize: none;
    font-family: inherit;
  }

  /* 닉네임 체크 */
  .nickname-check {
    display: flex;
    gap: 0.5rem;
  }

  .nickname-check .input-field {
    flex: 1;
  }

  .check-btn {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    border: none;
    background: linear-gradient(135deg, #7DBDB6, #8B9DC3);
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.2s;
  }

  .check-btn:hover {
    transform: scale(1.02);
  }

  .check-btn:active {
    transform: scale(0.98);
  }

  .nickname-message {
    font-size: 0.75rem;
    color: #EF4444;
    margin-top: 0.5rem;
  }

  .nickname-message.valid {
    color: #10B981;
  }

  /* 제출 버튼 */
  .submit-btn {
    width: 100%;
    padding: 0.875rem;
    border-radius: 0.75rem;
    border: none;
    background: linear-gradient(135deg, #7DBDB6, #8B9DC3);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(125, 189, 182, 0.3);
    transition: all 0.2s;
  }

  .submit-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(125, 189, 182, 0.4);
  }

  .submit-btn:active {
    transform: scale(0.98);
  }

  /* 하단 안내 문구 */
  .footer-text {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.75rem;
    color: #9CA3AF;
    line-height: 1.5;
  }

  .footer-text p {
    margin: 0;
  }

  /* 반응형 */
  @media (max-width: 640px) {
    .logo-circle {
      width: 5rem;
      height: 5rem;
    }

    .logo-emoji {
      font-size: 2.5rem;
    }

    .logo-text {
      font-size: 2rem;
    }

    .signup-card {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.25rem;
    }

    .intro {
      font-size: 0.875rem;
    }

    .preview {
      width: 5rem;
      height: 5rem;
    }
  }
</style>