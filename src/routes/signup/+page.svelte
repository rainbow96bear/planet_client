<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  // CSS Modules 임포트
  import styles from './page.module.css'; 

  // State Variables
  let nickname = "";
  let bio = "";
  let profileImage: File | null = null;
  let previewUrl: string | null = null;

  // Nickname Validation States
  let nicknameMessage = "";
  let isNicknameValidLocal = false;
  let isNicknameChecked = false;
  let isNicknameAvailableServer = false;

  // Form Submission State
  let isSubmitting = false;
  let formErrorMessage = "";

  // Regex for nickname validation (Matches backend's validNicknamePattern: alphanumeric, underscore)
  const nicknameRegex = /^[a-zA-Z0-9_]+$/;
  const minLength = 3;
  const maxLength = 15;

  // --- Functions ---

  function validateNicknameLocally() {
    isNicknameChecked = false;
    formErrorMessage = "";

    const trimmed = nickname.trim();
    if (trimmed.length === 0) {
      nicknameMessage = "닉네임을 입력해 주세요.";
      isNicknameValidLocal = false;
      return;
    }

    if (trimmed.length < minLength) {
      nicknameMessage = `닉네임은 최소 ${minLength}글자 이상이어야 합니다.`;
      isNicknameValidLocal = false;
      return;
    }

    if (trimmed.length > maxLength) {
      nicknameMessage = `닉네임은 최대 ${maxLength}글자를 초과할 수 없습니다.`;
      isNicknameValidLocal = false;
      return;
    }

    if (!nicknameRegex.test(trimmed)) {
      nicknameMessage = "닉네임에는 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.";
      isNicknameValidLocal = false;
      return;
    }

    if (trimmed.includes("__")) {
      nicknameMessage = "닉네임에 밑줄(_)을 연속으로 사용할 수 없습니다.";
      isNicknameValidLocal = false;
      return;
    }

    const reservedUsernames = ["admin", "root", "system", "support", "testuser"];
    if (reservedUsernames.includes(trimmed.toLowerCase())) {
      nicknameMessage = "해당 닉네임은 예약어로 사용할 수 없습니다.";
      isNicknameValidLocal = false;
      return;
    }

    nicknameMessage = "✅ 닉네임 유효성 검사를 통과했어요. 중복 확인을 해주세요!";
    isNicknameValidLocal = true;
  }

  async function checkNicknameAvailability() {
    formErrorMessage = "";
    if (!isNicknameValidLocal) {
      nicknameMessage = "먼저 닉네임 유효성 규칙을 만족해야 합니다.";
      return;
    }

    isNicknameChecked = true;
    nicknameMessage = "⏳ 중복 확인 중...";

    try {
      const res = await fetch(`/api/nicknames/available?nickname=${encodeURIComponent(nickname.trim())}`);
      const data = await res.json();

      if (res.ok && data.available) {
        nicknameMessage = "✨ 사용 가능한 닉네임이에요! 지금 바로 가입하세요.";
        isNicknameAvailableServer = true;
      } else {
        nicknameMessage = `❌ ${data.message || "이미 사용 중인 닉네임이에요."}`;
        isNicknameAvailableServer = false;
      }
    } catch {
      nicknameMessage = "⚠️ 서버 오류가 발생했어요. 다시 시도해 주세요.";
      isNicknameAvailableServer = false;
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
    formErrorMessage = "";

    if (!isNicknameValidLocal) {
      alert("닉네임 유효성 규칙을 만족해야 합니다.");
      return;
    }
    if (!isNicknameChecked || !isNicknameAvailableServer) {
      alert("닉네임 중복 확인을 완료하고 사용 가능한 닉네임을 선택해주세요.");
      return;
    }

    isSubmitting = true;
    const formData = new FormData();
    formData.append("nickname", nickname.trim());
    formData.append("bio", bio);
    if (profileImage) formData.append("profile_image", profileImage);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await res.json();
      if (res.ok) {
        if (data.redirect) {
          window.location.href = data.redirect;
        } else {
          goto('/login');
        }
      } else {
        let errorMessage = "회원가입 실패: ";
        if (data.error) {
          errorMessage = data.error;
        } else {
          errorMessage += "알 수 없는 오류가 발생했습니다.";
        }
        
        formErrorMessage = errorMessage;
      }
    } catch (err) {
      console.error("회원가입 요청 중 네트워크 오류:", err);
      formErrorMessage = "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    } finally {
      isSubmitting = false;
    }
  }

  $: nickname, validateNicknameLocally();
</script>

<div class={styles.container}>  
  <div class={styles.contentWrapper}>
    
    <div class={styles.logoSection}>
      <div class={styles.logoCircle}>
        <span class={styles.logoEmoji}>🪐</span>
      </div>
      <h1 class={styles.logoText}>Planet</h1>
      <p class={styles.tagline}>당신의 계획이 모여 하나의 행성이 됩니다</p>
    </div>

    <div class={styles.signupCard}>
      <h2 class={styles.cardTitle}>회원가입</h2>
      
      <p class={styles.intro}>
        오늘의 할 일을 기록하고,<br/>
        목표를 달성하며 친구들과 공유하세요 🌟
      </p>

      <form on:submit|preventDefault={handleSubmit}>
        <div class={styles.profileSection}>
          <div class={styles.preview} on:click={triggerFileInput}>
            {#if previewUrl}
              <img src={previewUrl} alt="프로필 미리보기" />
            {:else}
              <span class={styles.placeholderText}>🌌</span> {/if}
          </div>
          <input 
            id="fileInput" 
            type="file" 
            accept="image/*" 
            on:change={handleImageUpload} 
            style="display:none" 
          />
          <button type="button" class={styles.imageBtn} on:click={triggerFileInput}>
            {profileImage ? '이미지 변경' : '프로필 이미지 선택'}
          </button>
        </div>

        <div class={styles.formGroup}>
          <label for="nickname">닉네임</label>
          <div class={styles.nicknameCheck}>
            <input 
              id="nickname"
              type="text" 
              bind:value={nickname} 
              placeholder="영문, 숫자, 밑줄 3~15글자"
              class={styles.inputField}
              maxlength={maxLength}
            />
            <button 
              type="button" 
              class={styles.checkBtn} 
              on:click={checkNicknameAvailability}
              disabled={!isNicknameValidLocal || isNicknameChecked && isNicknameAvailableServer}
            >
              {#if isNicknameChecked && isNicknameAvailableServer}
                확인 완료
              {:else}
                중복 확인
              {/if}
            </button>
          </div>
          {#if nicknameMessage}
            <p 
              class={`${styles.nicknameMessage} ${isNicknameAvailableServer && isNicknameChecked ? styles.valid : ''} ${!isNicknameAvailableServer && isNicknameChecked || !isNicknameValidLocal ? styles.error : ''}`}
            >
              {nicknameMessage}
            </p>
          {/if}
        </div>

        <div class={styles.formGroup}>
          <label for="bio">자기소개</label>
          <textarea 
            id="bio"
            bind:value={bio} 
            rows="3" 
            placeholder="간단한 자기소개를 입력해주세요 (최대 100자)"
            maxlength="100"
            class={styles.textareaField}
          ></textarea>
        </div>

        {#if formErrorMessage}
          <p class={styles.formErrorMessage}>{formErrorMessage}</p>
        {/if}
        
        <button type="submit" class={styles.submitBtn} disabled={!isNicknameAvailableServer || !isNicknameChecked || !isNicknameValidLocal || isSubmitting}>
          {#if isSubmitting}
            가입 중... 🚀
          {:else}
            가입하기 🚀
          {/if}
        </button>
      </form>
    </div>

    <div class={styles.footerText}>
      <p>Planet에 가입하면 서비스 약관 및 개인정보 보호정책에</p>
      <p>동의하게 됩니다.</p>
    </div>
  </div>
</div>