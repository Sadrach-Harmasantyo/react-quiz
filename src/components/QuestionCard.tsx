import { memo } from "react";
import type { Question } from "../types";

// Props yang dibutuhkan oleh komponen QuestionCard
interface QuestionCardProps {
  question: Question;              // Data soal yang akan ditampilkan
  onAnswer: (answer: string) => void; // Callback ketika jawaban dipilih
  currentIndex: number;           // Indeks soal saat ini (0-based)
  totalQuestions: number;         // Total jumlah soal
}

// Fungsi untuk membandingkan props sebelum dan sesudah untuk menentukan apakah perlu re-render
// Ini untuk optimasi performa agar komponen tidak re-render jika tidak perlu
function arePropsEqual(prevProps: QuestionCardProps, nextProps: QuestionCardProps) {
  return (
    prevProps.currentIndex === nextProps.currentIndex &&
    prevProps.question.question === nextProps.question.question &&
    prevProps.totalQuestions === nextProps.totalQuestions
  );
}

function QuestionCard({
  question,
  onAnswer,
  currentIndex,
  totalQuestions,
}: QuestionCardProps) {
  // Fungsi untuk decode HTML entities dari API
  // Contoh: &quot; menjadi ", &#039; menjadi '
  const decodeHTML = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Siapkan array jawaban yang sudah diacak
  // Jika answers sudah ada, gunakan itu
  // Jika tidak, gabungkan correct_answer dan incorrect_answers lalu acak
  const answers =
    question.answers ||
    [...(question.incorrect_answers || []), question.correct_answer].sort(
      () => Math.random() - 0.5
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Tampilkan progress soal (misal: Question 1 of 10) */}
      <div className="mb-4 text-sm text-gray-500">
        Question {currentIndex + 1} of {totalQuestions}
      </div>

      <div className="mb-6">
        {/* Tampilkan kategori dan tingkat kesulitan soal */}
        <div className="flex gap-2">
          <span className="inline-block bg-[#29ab00] text-white text-xs px-2 py-1 rounded mb-2">
            {decodeHTML(question.category)}
          </span>
          <span className="inline-block bg-[#29ab00] text-white text-xs px-2 py-1 rounded mb-2">
            {decodeHTML(question.difficulty)}
          </span>
        </div>
        {/* Tampilkan pertanyaan */}
        <h3 className="text-xl font-semibold mb-4">
          {decodeHTML(question.question)}
        </h3>
      </div>

      {/* Tampilkan pilihan jawaban */}
      <div className="space-y-3">
        {answers.map((answer, index) => {
          return (
            <button
              key={index}
              onClick={() => onAnswer(answer)}
              className="w-full text-left p-4 border border-gray-300 rounded hover:bg-primary-green/10 duration-300 cursor-pointer"
            >
              <span>{decodeHTML(answer)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Export komponen yang sudah di-memoize untuk optimasi performa
export default memo(QuestionCard, arePropsEqual);
