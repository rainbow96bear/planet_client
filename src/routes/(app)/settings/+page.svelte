<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { get } from 'svelte/store';
    // 실제 경로에 맞게 수정
    import { theme, userProfile, isLoggedIn } from '$lib/stores'; 
    import { initSettingsPage, handleThemeChange, handleLogout, updateProfile, checkNicknameAvailability } from './settings';
    
    // 실제 경로에 맞게 수정
    import ThemeSelector from '$lib/components/common/themeSelector/ThemeSelector.svelte'; 
    import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte'; 
    
    // CSS Modules 임포트
    import styles from './settings.module.css';

    // 아이콘 (SVG)
    const IconBack = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
    const IconCamera = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
    const IconCheck = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    const IconX = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    let isLoading = true;
    let loginMessage = '';
    
    let isEditing = false;
    let currentNickname = '';
    let currentBio = '';
    
    let isSaving = false;
    let profileImageInput: HTMLInputElement;

    // 🌟 중복 검사 관련 상태
    let isCheckingNickname = false;
    let nicknameAvailable: boolean | null = null; // 타입: boolean | null (null: 확인 필요 상태)
    let nicknameFeedbackMessage = ''; // 사용자에게 표시할 상세 메시지
    let initialNickname = ''; // 초기 닉네임 값 저장

    // $userProfile 변경 감지 및 상태 동기화
    $: if ($userProfile) {
        if (!isEditing) {
            currentNickname = $userProfile.nickname || '';
            currentBio = $userProfile.bio || '';
            initialNickname = $userProfile.nickname || '';
            // 편집 모드가 아닐 때는 사용 가능으로 간주
            nicknameAvailable = true; 
            nicknameFeedbackMessage = '';
        }
    }

    // 🌟 닉네임 유효성 상태 관리 리액티브 블록
    $: {
        if (isEditing && currentNickname !== initialNickname) {
            // 닉네임을 변경하면, '확인 필요' 상태로 돌아가 버튼 클릭을 유도합니다.
            nicknameAvailable = null; 
            if (currentNickname.trim()) {
                nicknameFeedbackMessage = '닉네임 변경 후 [중복 확인] 버튼을 눌러주세요.';
            } else {
                nicknameFeedbackMessage = '닉네임을 입력해주세요.';
            }
        } else if (currentNickname === initialNickname) {
            // 닉네임이 초기값과 같으면 사용 가능한 것으로 간주합니다.
            nicknameAvailable = true;
            nicknameFeedbackMessage = '';
        } else if (!isEditing) {
            // 편집 모드가 아니면 초기화
            nicknameAvailable = true;
            nicknameFeedbackMessage = '';
        }
    }


    onMount(async () => {
        isLoading = true;
        const ok = await initSettingsPage();
        if (!ok) loginMessage = '로그인이 필요합니다.';
        else if ($userProfile) {
            await tick(); // DOM 업데이트를 기다려 바인딩 완료
            // 초기값 설정 (반복되지만 안전을 위해 명시적 설정)
            currentNickname = $userProfile.nickname || '';
            currentBio = $userProfile.bio || '';
            initialNickname = $userProfile.nickname || '';
            nicknameAvailable = true;
        }
        isLoading = false;
    });

    // 🌟 중복 검사 실행 함수 (버튼 클릭 시 호출)
    async function checkNicknameDuplication() {
        if (!currentNickname.trim()) {
            nicknameAvailable = null;
            nicknameFeedbackMessage = '닉네임을 입력해주세요.';
            isCheckingNickname = false;
            return;
        }
        
        isCheckingNickname = true;
        nicknameAvailable = null;
        nicknameFeedbackMessage = '중복 확인 중...';
        
        const result = await checkNicknameAvailability(currentNickname.trim());
        
        nicknameAvailable = result.available as boolean;
        
        // 반환된 메시지(message 또는 error)를 저장하여 UI에 표시
        if (result.message) {
             nicknameFeedbackMessage = result.message;
        } else if (result.error) {
             nicknameFeedbackMessage = result.error;
        } else if (nicknameAvailable === false) {
             nicknameFeedbackMessage = '사용할 수 없는 닉네임입니다.';
        } else if (nicknameAvailable === true) {
             nicknameFeedbackMessage = '사용 가능합니다.';
        }

        isCheckingNickname = false;
    }

    // 🌟 프로필 업데이트 핸들러
    async function handleProfileUpdate() {
        if (isSaving || !currentNickname.trim()) return;
        
        // 닉네임이 변경되었으나 아직 검사 상태가 유효하지 않은 경우
        if (currentNickname !== initialNickname) {
            // '중복 확인' 버튼을 누르지 않았거나, 유효하지 않은 상태일 때 강제로 검사 실행
            if (isCheckingNickname || nicknameAvailable !== true) {
                await checkNicknameDuplication(); 
            }
            // 재검사 후에도 유효하지 않다면 저장 중단
            if (nicknameAvailable === false) {
                alert('사용할 수 없는 닉네임입니다. 다시 확인해주세요.');
                return;
            } else if (nicknameAvailable === null) {
                alert('닉네임 중복 확인이 필요합니다.');
                return;
            }
        }
        
        isSaving = true;
        
        let imageUrl = $userProfile?.profile_image;
        // 여기에 파일 업로드 로직 추가
        /*
        const file = profileImageInput?.files?.[0];
        if (file) { ...upload logic... }
        */

        const success = await updateProfile(currentNickname, currentBio, imageUrl);
        if (success) isEditing = false;
        
        // 저장이 성공했으면 initialNickname을 현재 닉네임으로 업데이트
        if (success) {
            initialNickname = currentNickname; 
            nicknameAvailable = true;
            nicknameFeedbackMessage = '';
        }

        isSaving = false;
    }

    // 파일 선택 트리거
    function triggerFileInput() {
        if (isEditing) profileImageInput.click();
    }
</script>

{#if isLoading}
    <div class={styles.loadingContainer}><div class={styles.spinner}></div></div>
{:else if !isLoggedIn || !$userProfile}
    <LoginRequired message={loginMessage} />
{:else}
    <div class={styles.pageWrapper}>
        <header class={styles.appBar}>
            <button class={styles.navButton} on:click={() => history.back()} aria-label="뒤로">
                {@html IconBack}
            </button>
            
            <h1 class={styles.pageTitle}>프로필 설정</h1>
            
            <div class={styles.actionArea}>
                {#if isEditing}
                    <button 
                        class={styles.doneButton} 
                        on:click={handleProfileUpdate}
                        disabled={isSaving || !currentNickname.trim() || nicknameAvailable === false || nicknameAvailable === null || isCheckingNickname}
                    >
                        {isSaving ? '저장 중' : '완료'}
                    </button>
                {:else}
                    <button class={styles.editLink} on:click={() => isEditing = true}>
                        편집
                    </button>
                {/if}
            </div>
        </header>

        <main class={styles.content}>
            <section class={styles.profileHero}>
                <div class={styles.avatarWrapper} class:editable={isEditing} on:click={triggerFileInput} role="button" tabindex="0" on:keydown={()=>{}}>
                    <div class={styles.avatar}>
                        {#if $userProfile.profile_image}
                            <img src={$userProfile.profile_image} alt="avatar" />
                        {:else}
                            <span class={styles.avatarPlaceholder}>🪐</span>
                        {/if}
                    </div>
                    
                    {#if isEditing}
                        <div class={styles.editBadge}>
                            {@html IconCamera}
                        </div>
                        <input 
                            type="file" 
                            bind:this={profileImageInput}
                            accept="image/*"
                            hidden
                            on:change={() => {/* preview logic */}}
                        />
                    {/if}
                </div>

                <div class={styles.infoForm}>
                    {#if isEditing}
                        <div class={styles.inputGroup}>
                            <label for="nick">닉네임</label>
                            
                            <div class={styles.inputWithButton}> 
                                <input 
                                    id="nick"
                                    class={styles.minimalInput}
                                    type="text" 
                                    bind:value={currentNickname}
                                    placeholder="닉네임"
                                    disabled={isCheckingNickname}
                                    aria-describedby="nickname-feedback"
                                />
                                
                                <button
                                    class={styles.checkButton} 
                                    on:click={checkNicknameDuplication}
                                    disabled={isCheckingNickname || !currentNickname.trim() || currentNickname === initialNickname}
                                    aria-live="polite"
                                >
                                    {isCheckingNickname ? '확인 중' : '중복 확인'}
                                </button>
                            </div>

                                                        {#if nicknameFeedbackMessage}
                                <p 
                                    id="nickname-feedback"
                                    class={styles.feedbackMessage}
                                    style="color: {nicknameAvailable === true ? '#10b981' : (nicknameAvailable === false ? '#ef4444' : 'var(--color-text-secondary)')};"
                                >
                                    {#if isCheckingNickname}
                                                                            {:else if nicknameAvailable === true}
                                        {@html IconCheck}
                                    {:else if nicknameAvailable === false}
                                        {@html IconX}
                                    {/if}
                                    {nicknameFeedbackMessage}
                                </p>
                            {/if}
                        </div>
                        <div class={styles.inputGroup}>
                            <label for="bio">소개</label>
                            <textarea 
                                id="bio"
                                class={styles.minimalTextarea}
                                bind:value={currentBio}
                                placeholder="자기소개를 입력해주세요."
                                rows="3"
                            ></textarea>
                        </div>
                    {:else}
                        <h2 class={styles.displayName}>{$userProfile.nickname}</h2>
                        <p class={styles.displayBio}>{$userProfile.bio || '소개가 없습니다.'}</p>
                    {/if}
                </div>
            </section>

            <section class={styles.settingsGroup}>
                <div class={styles.groupTitle}>앱 설정</div>
                <div class={styles.settingsItem}>
                    <span class={styles.itemLabel}>테마 설정</span>
                    <div class={styles.itemAction}>
                        <ThemeSelector currentTheme={$theme} on:change={handleThemeChange} />
                    </div>
                </div>
            </section>

            <section class={styles.dangerZone}>
                <button class={styles.logoutButton} on:click={handleLogout}>
                    로그아웃
                </button>
            </section>
        </main>
    </div>
{/if}