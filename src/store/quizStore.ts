import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question } from "../types";

/**
 * Interface untuk mendefinisikan struktur state dan actions dalam quiz store
 * State menyimpan data quiz dan actions untuk memanipulasi state
 */
interface QuizState {
  // === State ===
  questions: Question[];           // Array yang menyimpan semua soal quiz
  currentQuestionIndex: number;    // Index soal yang sedang aktif/ditampilkan
  score: number;                   // Skor total jawaban benar
  answers: (string | null)[];      // Array untuk menyimpan jawaban user (null jika belum dijawab)
  isFinished: boolean;            // Status apakah quiz sudah selesai
  timeRemaining: number;          // Waktu tersisa dalam detik
  hasActiveQuiz: boolean;         // Flag untuk menandai ada quiz yang sedang berjalan (untuk fitur resume)

  // === Actions ===
  setQuestions: (questions: Question[]) => void;     // Action untuk menginisialisasi quiz dengan soal baru
  answerQuestion: (answer: string) => void;          // Action untuk menyimpan jawaban user
  nextQuestion: () => void;                          // Action untuk pindah ke soal berikutnya
  resetQuiz: () => void;                            // Action untuk mereset quiz ke kondisi awal
  updateTimeRemaining: (time: number) => void;       // Action untuk update sisa waktu
  finishQuiz: () => void;                           // Action untuk menandai quiz selesai
}

/**
 * State awal quiz
 * Digunakan saat inisialisasi pertama dan saat reset quiz
 */
const initialState = {
  questions: [],                // Array soal kosong
  currentQuestionIndex: 0,      // Mulai dari soal pertama
  score: 0,                     // Skor awal 0
  answers: [],                  // Belum ada jawaban
  isFinished: false,           // Quiz belum selesai
  timeRemaining: 300,          // 5 menit dalam detik
  hasActiveQuiz: false,        // Belum ada quiz aktif
};

/**
 * Quiz store menggunakan Zustand dengan persist middleware
 * Persist middleware menyimpan state di localStorage sehingga tidak hilang saat browser ditutup
 */
export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      // Inisialisasi dengan state awal
      ...initialState,

      /**
       * Action untuk menginisialisasi quiz baru dengan soal-soal
       * @param questions - Array soal yang akan digunakan
       */
      setQuestions: (questions) =>
        set({
          questions,                                    // Set soal baru
          answers: Array(questions.length).fill(null),  // Inisialisasi array jawaban kosong
          currentQuestionIndex: 0,                      // Mulai dari soal pertama
          score: 0,                                     // Reset skor
          isFinished: false,                           // Quiz baru dimulai
          timeRemaining: 300,                          // Reset timer ke 5 menit
          hasActiveQuiz: true,                         // Tandai ada quiz aktif
        }),

      /**
       * Action untuk menyimpan jawaban user dan update skor
       * @param answer - Jawaban yang dipilih user
       */
      answerQuestion: (answer) =>
        set((state) => {
          const newAnswers = [...state.answers];              // Copy array jawaban
          newAnswers[state.currentQuestionIndex] = answer;    // Simpan jawaban baru

          // Cek apakah jawaban benar
          const isCorrect =
            answer === state.questions[state.currentQuestionIndex].correct_answer;

          return {
            answers: newAnswers,
            // Update skor jika jawaban benar
            score: isCorrect ? state.score + 1 : state.score,
          };
        }),

      /**
       * Action untuk pindah ke soal berikutnya
       * Jika sudah di soal terakhir, quiz akan ditandai selesai
       */
      nextQuestion: () =>
        set((state) => {
          // Cek apakah ini soal terakhir
          if (state.currentQuestionIndex >= state.questions.length - 1) {
            return { 
              isFinished: true,      // Quiz selesai
              hasActiveQuiz: false   // Tidak ada quiz aktif lagi
            };
          }
          // Jika bukan soal terakhir, increment index
          return { 
            currentQuestionIndex: state.currentQuestionIndex + 1 
          };
        }),

      /**
       * Action untuk mereset quiz ke kondisi awal
       * Digunakan saat memulai quiz baru
       */
      resetQuiz: () => set(initialState),

      /**
       * Action untuk update waktu tersisa
       * Jika waktu habis, quiz akan ditandai selesai
       * @param time - Waktu tersisa dalam detik
       */
      updateTimeRemaining: (time) => 
        set(() => ({
          timeRemaining: time,
          // Jika waktu habis, selesaikan quiz
          ...(time <= 0 ? { 
            isFinished: true, 
            hasActiveQuiz: false 
          } : {})
        })),

      /**
       * Action untuk menandai quiz selesai
       * Digunakan saat waktu habis atau user menyelesaikan semua soal
       */
      finishQuiz: () => set({ 
        isFinished: true, 
        hasActiveQuiz: false 
      }),
    }),
    {
      name: "quiz-storage",  // Nama untuk identifikasi di localStorage
      version: 1,           // Versi storage untuk keperluan migrasi data
    }
  )
);
