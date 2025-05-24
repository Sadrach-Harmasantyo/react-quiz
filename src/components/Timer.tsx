import { memo } from "react";

interface TimerProps {
  timeRemaining: number;
}

/**
 * Komponen Timer untuk menampilkan waktu tersisa dalam format MM:SS
 * Komponen ini di-memoize untuk mencegah render ulang yang tidak perlu
 */
function Timer({ timeRemaining }: TimerProps) {
  // Konversi detik ke menit dan detik
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Format waktu dalam bentuk MM:SS dengan padding nol di depan jika perlu
  const formattedTime = `${minutes.toString().padStart(2, "0")} : ${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="flex items-center bg-white/10 backdrop-blur-lg px-4 py-2 rounded-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-primary-green"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-lg font-bold text-primary-green">{formattedTime}</span>
    </div>
  );
}

// Export komponen yang di-memoize untuk optimasi performa
export default memo(Timer);
