import { useState, useEffect, useRef } from 'react';

interface UseQuizTimerProps {
  initialTime: number;    // Waktu awal dalam detik
  isActive: boolean;      // Status aktif timer
  onTimeUp: () => void;   // Callback ketika waktu habis
  onTimeUpdate?: (time: number) => void;  // Callback untuk update waktu di store
}

/**
 * Custom hook untuk mengelola timer quiz
 * @param initialTime Waktu awal dalam detik
 * @param isActive Status aktif timer
 * @param onTimeUp Callback yang dipanggil ketika waktu habis
 * @param onTimeUpdate Callback opsional untuk update waktu di store
 * @returns Waktu yang ditampilkan dalam detik
 */
export function useQuizTimer({
  initialTime,
  isActive,
  onTimeUp,
  onTimeUpdate
}: UseQuizTimerProps): number {
  // State lokal untuk display time (menghindari re-render komponen utama)
  const [displayTime, setDisplayTime] = useState(initialTime);
  
  // Ref untuk melacak waktu sebenarnya dan interval timer
  const timeRef = useRef(initialTime);
  const timerRef = useRef<number | undefined>(undefined);

  // Effect untuk update ref dan state ketika initialTime berubah
  useEffect(() => {
    // Hanya update jika waktu baru lebih besar dari waktu saat ini
    // Ini mencegah reset timer ketika melanjutkan quiz yang sudah berjalan
    if (initialTime > timeRef.current) {
      timeRef.current = initialTime;
      setDisplayTime(initialTime);
    }
  }, [initialTime]);

  // Effect untuk mengelola timer
  useEffect(() => {
    // Bersihkan timer yang ada jika ada
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Jika timer tidak aktif, tidak perlu membuat interval baru
    if (!isActive) return;

    // Buat interval baru untuk menghitung mundur
    timerRef.current = window.setInterval(() => {
      if (timeRef.current > 0) {
        // Kurangi waktu
        timeRef.current -= 1;
        
        // Update state lokal untuk display
        setDisplayTime(timeRef.current);
        
        // Update store jika callback disediakan
        if (onTimeUpdate) {
          onTimeUpdate(timeRef.current);
        }
      } else {
        // Bersihkan timer ketika waktu habis
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        onTimeUp();
      }
    }, 1000);

    // Cleanup function untuk membersihkan interval
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, onTimeUp, onTimeUpdate]);

  // Effect untuk menyimpan state timer sebelum browser ditutup
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isActive && onTimeUpdate) {
        onTimeUpdate(timeRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive, onTimeUpdate]);

  return displayTime;
}