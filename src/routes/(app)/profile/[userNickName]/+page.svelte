<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { get } from "svelte/store";

  interface User {
    nickname: string;
    email: string;
    joinedAt: string;
    avatar?: string;
  }

  let user: User | null = null;
  let loading = true;
  let canEdit = false;

  const { userNickName } = get(page).params;

  function getJwtFromCookie(): string | null {
    const match = document.cookie.match(/jwt=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function decodeJwt(token: string): any {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  onMount(async () => {
    try {
      const res = await fetch(`/api/user/${userNickName}`);
      if (!res.ok) throw new Error("failed to fetch user");

      user = await res.json();

      const jwt = getJwtFromCookie();
      if (jwt) {
        const decoded = decodeJwt(jwt);
        if (decoded?.nickname === userNickName) {
          canEdit = true;
        }
      }
    } catch (err) {
      console.error("failed to load profile", err);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="loading">Loading...</div>
{:else if user}
  <div class="profile-card">
    {#if user.avatar}
      <img src={user.avatar} alt="User avatar" class="avatar" />
    {:else}
      <div class="avatar placeholder">{user.nickname[0].toUpperCase()}</div>
    {/if}

    <h1 class="nickname">{user.nickname}</h1>
    <p class="email">{user.email}</p>
    <p class="joined">Joined: {new Date(user.joinedAt).toLocaleDateString()}</p>

    {#if canEdit}
      <button class="edit-btn">프로필 수정</button>
    {/if}
  </div>
{:else}
  <div class="error">사용자 정보를 불러올 수 없습니다.</div>
{/if}

<style>
  .loading,
  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.2rem;
    color: #555;
  }

  .error {
    color: #e63946;
  }

  .profile-card {
    margin: 3rem auto;
    padding: 2rem;
    background: #f5e8c7;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 1rem;
    display: block;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .avatar.placeholder {
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: #555;
  }

  .nickname {
    font-size: 1.6rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .email {
    font-size: 1rem;
    color: #555;
    margin-bottom: 0.5rem;
  }

  .joined {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 1rem;
  }

  .edit-btn {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    background-color: #0077cc;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .edit-btn:hover {
    background-color: #005fa3;
  }
</style>
