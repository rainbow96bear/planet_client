// lib/services/feed/feed.service.ts
import { feedStore } from '$lib/stores/feed/feed.store';
import type { FeedItem } from '$lib/stores/feed/feed.types';

// Mock 데이터는 개발 환경에서만 사용
const USE_MOCK = import.meta.env.DEV;

export const feedService = {
  /**
   * 피드 목록 로드
   */
  async loadFeeds(fetchFn: typeof fetch = fetch): Promise<void> {
    feedStore.setLoading(true);
    feedStore.resetError();

    try {
      if (USE_MOCK) {
        // 개발 환경: Mock 데이터
        const { mockFeeds } = await import('$lib/stores/feed/feed.mock');
        
        // 네트워크 지연 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 600));
        
        feedStore.setFeeds(mockFeeds);
      } else {
        // 프로덕션: 실제 API 호출
        const res = await fetchFn('/api/feeds');
        
        if (!res.ok) {
          throw new Error('피드 조회 실패');
        }
        
        const feeds: FeedItem[] = await res.json();
        feedStore.setFeeds(feeds);
      }
    } catch (error) {
      console.error('[feedService.loadFeeds]', error);
      feedStore.setError(
        error instanceof Error ? error.message : '피드를 불러오는데 실패했습니다'
      );
      feedStore.setFeeds([]);
    } finally {
      feedStore.setLoading(false);
    }
  },

  /**
   * 피드 좋아요 토글
   */
  async toggleLike(feedId: number, fetchFn: typeof fetch = fetch): Promise<void> {
    // 낙관적 업데이트
    feedStore.toggleLike(feedId);

    try {
      if (!USE_MOCK) {
        const res = await fetchFn(`/api/feeds/${feedId}/like`, {
          method: 'POST'
        });

        if (!res.ok) {
          throw new Error('좋아요 처리 실패');
        }
      }
    } catch (error) {
      console.error('[feedService.toggleLike]', error);
      
      // 실패 시 롤백
      feedStore.toggleLike(feedId);
      feedStore.setError('좋아요 처리에 실패했습니다');
    }
  },

  /**
   * 피드 북마크 토글
   */
  async toggleBookmark(feedId: number, fetchFn: typeof fetch = fetch): Promise<void> {
    // 낙관적 업데이트
    feedStore.toggleBookmark(feedId);

    try {
      if (!USE_MOCK) {
        const res = await fetchFn(`/api/feeds/${feedId}/bookmark`, {
          method: 'POST'
        });

        if (!res.ok) {
          throw new Error('북마크 처리 실패');
        }
      }
    } catch (error) {
      console.error('[feedService.toggleBookmark]', error);
      
      // 실패 시 롤백
      feedStore.toggleBookmark(feedId);
      feedStore.setError('북마크 처리에 실패했습니다');
    }
  },

  /**
   * 특정 사용자의 피드만 로드
   */
  async loadUserFeeds(nickname: string, fetchFn: typeof fetch = fetch): Promise<void> {
    feedStore.setLoading(true);
    feedStore.resetError();

    try {
      const res = await fetchFn(`/api/users/${nickname}/feeds`);
      
      if (!res.ok) {
        throw new Error('사용자 피드 조회 실패');
      }
      
      const feeds: FeedItem[] = await res.json();
      feedStore.setFeeds(feeds);
    } catch (error) {
      console.error('[feedService.loadUserFeeds]', error);
      feedStore.setError('피드를 불러오는데 실패했습니다');
      feedStore.setFeeds([]);
    } finally {
      feedStore.setLoading(false);
    }
  }
};