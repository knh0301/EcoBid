import {useRef, useState} from 'react';

type FavoriteToastType = 'liked' | 'unliked';

type FavoriteToastState = {
  visible: boolean;
  message: string;
  type: FavoriteToastType;
};

export function useFavoriteToast() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<FavoriteToastState>({
    visible: false,
    message: '',
    type: 'liked',
  });

  const showFavoriteToast = (message: string, type: FavoriteToastType) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({
      visible: true,
      message,
      type,
    });

    timerRef.current = setTimeout(() => {
      setToast(prev => ({
        ...prev,
        visible: false,
      }));
    }, 1700);
  };

  return {
    toast,
    showFavoriteToast,
  };
}
