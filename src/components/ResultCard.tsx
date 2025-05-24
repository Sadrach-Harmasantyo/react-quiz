import { useQuizStore } from "../store/quizStore";

// Props untuk komponen ResultCard
interface ResultCardProps {
  onReset: () => void;  // Callback untuk memulai quiz baru
}

export default function ResultCard({ onReset }: ResultCardProps) {
  // Ambil data hasil quiz dari store
  const { questions, score, answers } = useQuizStore();

  // Hitung statistik hasil quiz
  const totalQuestions = questions.length;
  const correctAnswers = score;
  // Hitung jawaban salah (jawaban yang dipilih tapi tidak benar)
  const wrongAnswers = answers.filter(
    (answer, index) =>
      answer !== null && answer !== questions[index].correct_answer
  ).length;
  // Hitung soal yang tidak dijawab
  const unanswered = totalQuestions - correctAnswers - wrongAnswers;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Quiz Results</h2>

      {/* Grid untuk menampilkan statistik jawaban */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Jawaban benar */}
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600">
            {correctAnswers}
          </div>
          <div className="text-sm text-green-800">Correct</div>
        </div>

        {/* Jawaban salah */}
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-red-600">{wrongAnswers}</div>
          <div className="text-sm text-red-800">Wrong</div>
        </div>

        {/* Soal yang tidak dijawab */}
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-gray-600">{unanswered}</div>
          <div className="text-sm text-gray-800">Unanswered</div>
        </div>
      </div>

      {/* Progress bar dan skor akhir */}
      <div className="mb-6">
        {/* Progress bar menunjukkan persentase jawaban benar */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#29ab00]"
            style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
          ></div>
        </div>
        {/* Tampilkan skor dalam persentase */}
        <div className="text-center mt-2 font-semibold">
          Score: {Math.round((correctAnswers / totalQuestions) * 100)}%
        </div>
      </div>

      {/* Tombol untuk memulai quiz baru */}
      <button
        onClick={onReset}
        className="w-full bg-[#29ab00] cursor-pointer text-white py-2 rounded-lg font-semibold transition hover:bg-[#218c00]"
      >
        Start New Quiz
      </button>
    </div>
  );
}
