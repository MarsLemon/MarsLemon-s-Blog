'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  postId: number;
}

export function ViewTracker({ postId }: ViewTrackerProps) {
  useEffect(() => {
    // 记录访问
    const recordView = async () => {
      try {
        await fetch('/api/analytics/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId }),
        });
      } catch (error) {
        console.error('记录访问失败:', error);
      }
    };

    recordView();
  }, [postId]);

  return null;
}
