import type { Question } from "../types";

// URL API dari OpenTDB (The Open Trivia Database)
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fungsi untuk mengambil soal quiz dari OpenTDB API
 * @param amount Jumlah soal yang diinginkan (default: 10)
 * @param difficulty Tingkat kesulitan soal (default: medium)
 * @returns Promise yang berisi array soal yang sudah diformat
 */
export async function fetchQuizQuestions(
  amount = 10,
  difficulty = "medium"
): Promise<Question[]> {
  // Fetch soal dari API dengan parameter yang ditentukan
  // type=multiple berarti hanya mengambil soal pilihan ganda
  const response = await fetch(
    `${API_URL}?amount=${amount}&difficulty=${difficulty}&type=multiple`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  // Transform data dari API ke format yang sesuai dengan aplikasi
  return data.results.map((question: Question) => ({
    ...question,
    // Gabungkan jawaban benar dan salah, lalu acak urutannya
    answers: [...question.incorrect_answers, question.correct_answer].sort(
      () => Math.random() - 0.5
    ),
  }));
}
