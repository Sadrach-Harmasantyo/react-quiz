import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
          alt="Quiz background"
          className="w-full h-full object-cover brightness-50"
        />
      </div>

      <div className="max-w-6xl w-full mx-auto relative z-10 text-white px-5">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="inline-block">Test Your Knowledge</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Challenge yourself with our interactive quizzes. Explore various
            topics and see how much you know!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/quiz")}
              className="bg-primary-green text-white text-lg px-8 py-4 rounded-lg font-medium duration-300 cursor-pointer"
            >
              Start Quiz
            </button>

            {!user.isLoggedIn && (
              <button
                onClick={() => navigate("/login")}
                className="border border-white text-white text-lg px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[#29ab00] transition"
              >
                Login
              </button>
            )}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid lg:grid-cols-4 gap-8 mt-24">
          <div className="bg-white/30 bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg text-center">
            <h3 className="text-3xl font-bold mb-2">10+</h3>
            <p>Questions</p>
          </div>
          <div className="bg-white/30 bg-opacity-10 backdrop-blur-lg p-6 rounded-lg text-center">
            <h3 className="text-3xl font-bold mb-2">5+</h3>
            <p>Minutes Only</p>
          </div>
          <div className="bg-white/30 bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg text-center">
            <h3 className="text-3xl font-bold mb-2">0 - 10</h3>
            <p>Summary Performance</p>
          </div>
          <div className="bg-white/30 bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg text-center">
            <h3 className="text-3xl font-bold mb-2">24/7</h3>
            <p>Available</p>
          </div>
        </div>
      </div>
    </section>
  );
}
