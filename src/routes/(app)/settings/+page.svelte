<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { user } from '$lib/stores/user';
    import { isLoggedIn } from '$lib/stores/auth';

    import {
        handleThemeChange,
        handleLogout,
        updateProfile,
        checkNicknameAvailability
    } from './settings';

    import ThemeSelector from '$lib/components/common/themeSelector/ThemeSelector.svelte';
    import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte';

    import styles from './page.module.css';

    const IconBack = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
    const IconCamera = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
    const IconCheck = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    const IconX = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    let isLoading = true;
    let loginMessage = '';

    let isEditing = false;
    let currentNickname = '';
    let currentBio = '';
    let initialNickname = '';

    let isSaving = false;
    let profileImageInput: HTMLInputElement;

    let isCheckingNickname = false;
    let nicknameAvailable: boolean | null = null;
    let nicknameFeedbackMessage = '';

    $: if ($user && !isEditing) {
        currentNickname = $user.nickname || '';
        currentBio = $user.bio || '';
        initialNickname = $user.nickname || '';
        nicknameAvailable = true;
        nicknameFeedbackMessage = '';
    }

    $: {
        if (isEditing && currentNickname !== initialNickname) {
            nicknameAvailable = null;
            nicknameFeedbackMessage = currentNickname.trim()
                ? '닉네임 변경 후 [중복 확인] 버튼을 눌러주세요.'
                : '닉네임을 입력해주세요.';
        } else if (currentNickname === initialNickname) {
            nicknameAvailable = true;
            nicknameFeedbackMessage = '';
        }
    }

    onMount(async () => {
        isLoading = true;

        if (!$isLoggedIn) {
            loginMessage = '로그인이 필요합니다.';
            isLoading = false;
            return;
        }

        await tick();

        currentNickname = $user.nickname || '';
        currentBio = $user.bio || '';
        initialNickname = currentNickname;
        nicknameAvailable = true;

        isLoading = false;
    });

    async function checkNicknameDuplication() {
        if (!currentNickname.trim()) {
            nicknameAvailable = null;
            nicknameFeedbackMessage = '닉네임을 입력해주세요.';
            return;
        }

        isCheckingNickname = true;
        nicknameAvailable = null;
        nicknameFeedbackMessage = '중복 확인 중...';

        const result = await checkNicknameAvailability(currentNickname.trim());

        nicknameAvailable = result.available as boolean;

        if (result.message) nicknameFeedbackMessage = result.message;
        else if (result.error) nicknameFeedbackMessage = result.error;
        else if (nicknameAvailable === false) nicknameFeedbackMessage = '사용할 수 없는 닉네임입니다.';
        else nicknameFeedbackMessage = '사용 가능합니다.';

        isCheckingNickname = false;
    }

    async function handleProfileUpdate() {
        if (isSaving || !currentNickname.trim()) return;

        if (currentNickname !== initialNickname) {
            if (isCheckingNickname || nicknameAvailable !== true) {
                await checkNicknameDuplication();
            }

            if (nicknameAvailable !== true) {
                alert('닉네임 사용 여부를 다시 확인해주세요.');
                return;
            }
        }

        isSaving = true;

        let imageUrl = $user?.profileImage;

        const success = await updateProfile(currentNickname, currentBio, imageUrl);

        if (success) {
            isEditing = false;
            initialNickname = currentNickname;
            nicknameAvailable = true;
            nicknameFeedbackMessage = '';
        }

        isSaving = false;
    }

    function triggerFileInput() {
        if (isEditing) profileImageInput?.click();
    }
</script>

{#if isLoading}
    <div class={styles.loadingContainer}><div class={styles.spinner}></div></div>

{:else if !$isLoggedIn}
    <LoginRequired message={loginMessage} />

{:else}

        <header class={styles.appBar}>
            <button class={styles.navButton} on:click={() => history.back()}>
                {@html IconBack}
            </button>

            <h1 class={styles.pageTitle}>프로필 설정</h1>

            <div class={styles.actionArea}>
                {#if isEditing}
                    <button
                        class={styles.doneButton}
                        on:click={handleProfileUpdate}
                        disabled={
                            isSaving ||
                            !currentNickname.trim() ||
                            nicknameAvailable === false ||
                            nicknameAvailable === null ||
                            isCheckingNickname
                        }
                        type="button"
                    >
                        {isSaving ? '저장 중' : '완료'}
                    </button>
                {:else}
                    <button
                        class={styles.editLink}
                        on:click={() => (isEditing = true)}
                        type="button"
                    >
                        편집
                    </button>
                {/if}
            </div>
        </header>

        <main class={styles.content}>

            <section class={styles.profileHero}>

                <!-- 접근성 개선: div → button -->
                <button
                    type="button"
                    class={`${styles.avatarWrapper} ${isEditing ? styles.editable : ''}`}
                    on:click={triggerFileInput}
                >
                    <div class={styles.avatar}>
                        {#if $user.profileImage}
                            <img src={$user.profileImage} alt="avatar" />
                        {:else}
                            <span class={styles.avatarPlaceholder}>🪐</span>
                        {/if}
                    </div>

                    {#if isEditing}
                        <div class={styles.editBadge}>{@html IconCamera}</div>
                        <input
                            type="file"
                            bind:this={profileImageInput}
                            accept="image/*"
                            hidden
                        />
                    {/if}
                </button>

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
                                />

                                <button
                                    class={styles.checkButton}
                                    on:click={checkNicknameDuplication}
                                    disabled={
                                        isCheckingNickname ||
                                        !currentNickname.trim() ||
                                        currentNickname === initialNickname
                                    }
                                    type="button"
                                >
                                    {isCheckingNickname ? '확인 중' : '중복 확인'}
                                </button>
                            </div>

                            {#if nicknameFeedbackMessage}
                                <p
                                    class={styles.feedbackMessage}
                                    style="color: {
                                        nicknameAvailable === true
                                            ? '#10b981'
                                            : nicknameAvailable === false
                                            ? '#ef4444'
                                            : 'var(--color-text-secondary)'
                                    };"
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
                        <h2 class={styles.displayName}>{$user.nickname}</h2>
                        <p class={styles.displayBio}>{$user.bio || '소개가 없습니다.'}</p>
                    {/if}
                </div>
            </section>

            <section class={styles.settingsGroup}>
                <div class={styles.groupTitle}>앱 설정</div>

                <div class={styles.settingsItem}>
                    <span class={styles.itemLabel}>테마 설정</span>
                    {#if $user?.theme}
                        <ThemeSelector
                            currentTheme={$user.theme}
                            on:change={handleThemeChange}
                        />
                    {/if}
                </div>
            </section>

            <section class={styles.dangerZone}>
                <button class={styles.logoutButton} on:click={handleLogout} type="button">
                    로그아웃
                </button>
            </section>

        </main>
{/if}
