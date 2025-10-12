<script lang="ts">
  import { goto } from '$app/navigation';

  let nickname = "";
  let bio = "";
  let profileImage: File | null = null;
  let previewUrl: string | null = null;

  let nicknameMessage = "";
  let isNicknameValid = false;

  const nicknameRegex = /^[a-zA-Z][a-zA-Z0-9_]{1,14}$/; // 영어 시작, 2~15글자, _ 허용

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

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
  padding: 1rem;
}

.card {
  background: #fff;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 1.9rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #111827;
}

p.intro {
  text-align: center;
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.5;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: block;
  color: #111827;
}

.nickname-check {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nickname-check input[type="text"] {
  flex: 1;
}

input[type="text"], textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="text"]:focus, textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}

textarea {
  width: 100%;
  min-height: 80px;      /* 최소 높이 지정 */
  max-height: 150px;     /* 최대 높이 지정 */
  padding: 0.7rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  resize: none;          /* 사용자가 크기 조절 불가 */
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box; /* padding 포함 너비 계산 */
}

textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}

.nickname-message {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* 프로필 이미지 영역 */
.profile-row {
  display: flex;
  align-items: center;
  justify-content: center; /* 가운데 정렬 */
  gap: 1rem;
  margin-bottom: 1.5rem; /* 아래 요소와 간격 */
}

.preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #d1d5db;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #f9fafb;
  flex-shrink: 0; /* 크기 고정 */
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-row button {
  height: 40px;
  padding: 0 1rem;
  border-radius: 8px;
  background-color: #10b981;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.profile-row button:hover {
  background-color: #059669;
}

/* 버튼 스타일 */
.signup-button {
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
    color: #fff;
   background: #10b981;
}

.signup-button:hover {
  background: #059669;
}

</style>

<div class="container">
  <div class="card">
    <h1>Planet 회원가입</h1>
    <p class="intro">
      오늘의 할 일을 기록하고, 목표를 달성하며 친구들과 공유하세요 🌟
    </p>

    <form on:submit|preventDefault={handleSubmit}>
      <!-- 프로필 이미지 + 버튼 -->
      <div class="profile-row">
        <div class="preview">
          {#if previewUrl}
            <img src={previewUrl} alt="프로필 미리보기" />
          {:else}
            <span style="color:#9ca3af; font-size:0.9rem;">이미지 없음</span>
          {/if}
        </div>
        <div>
          <input id="fileInput" type="file" accept="image/*" on:change={handleImageUpload} style="display:none" />
          <button type="button" class="signup-button" on:click={triggerFileInput}>이미지 선택</button>
        </div>
      </div>

      <!-- 닉네임 -->
      <div>
        <label>닉네임</label>
        <div class="nickname-check">
          <input type="text" bind:value={nickname} placeholder="영문 시작, 2~15글자" />
          <button type="button" class="signup-button" on:click={checkNickname}>중복 확인</button>
        </div>
        <p class="nickname-message">{nicknameMessage}</p>
      </div>

      <!-- 자기소개 -->
      <div>
        <label>자기소개</label>
        <textarea bind:value={bio} rows="3" placeholder="간단한 자기소개를 입력해주세요"></textarea>
      </div>

      <!-- 가입 버튼 -->
      <button type="submit" class="signup-button">가입하기 🚀</button>
    </form>
  </div>
</div>
