import { useEffect, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQuizStore } from "../store/quizStore";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import ResultCard from "../components/ResultCard";
import { fetchQuizQuestions } from "../api/fetchQuizQuestions";
import { useQuizTimer } from "../hooks/useQuizTimer";

// Memoize komponen Timer untuk mencegah render ulang yang tidak perlu
const MemoizedTimer = memo(Timer);

export default function Quiz() {
  // Ambil state dan actions dari quiz store
  const {
    questions,
    currentQuestionIndex,
    isFinished,
    timeRemaining,
    hasActiveQuiz,
    setQuestions,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    updateTimeRemaining,
    finishQuiz,
  } = useQuizStore();

  // Gunakan custom hook untuk timer
  const displayTime = useQuizTimer({
    initialTime: timeRemaining,
    isActive: !isFinished && questions.length > 0,
    onTimeUp: finishQuiz,
    onTimeUpdate: updateTimeRemaining,
  });

  // Fetch soal menggunakan React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["quizQuestions"],
    queryFn: () => fetchQuizQuestions(10, "medium"),
    enabled: !hasActiveQuiz && questions.length === 0 && !isFinished,
  });

  // Set soal ke store ketika data berhasil di-fetch
  useEffect(() => {
    if (data && !hasActiveQuiz && !isFinished) {
      setQuestions(data);
    }
  }, [data, setQuestions, hasActiveQuiz, isFinished]);

  // Handle jawaban user
  const handleAnswer = (answer: string) => {
    answerQuestion(answer);
    // Pindah ke soal berikutnya setelah delay singkat
    setTimeout(() => {
      nextQuestion();
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl">Memuat soal...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex justify-center items-center flex-col">
          <div className="text-xl text-red-600 mb-4">
            Error saat memuat soal!
          </div>
          <button
            onClick={() => refetch()}
            className="bg-primary-green text-white px-4 py-2 rounded cursor-pointer hover:bg-primary-green/80 duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }


  // Ambil soal saat ini
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen max-w-6xl w-full mx-auto">
      <div className="container mx-auto py-32 px-4">
        {!isFinished ? (
          <>
            <div className="mb-5 mx-auto flex justify-center">
              <MemoizedTimer timeRemaining={displayTime} />
            </div>

            {questions.length > 0 && currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
              />
            )}
          </>
        ) : (
          <ResultCard onReset={() => {
            resetQuiz();
            refetch();
          }} />
        )}
      </div>
    </div>
  );
}
