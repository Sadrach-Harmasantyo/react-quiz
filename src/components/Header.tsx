import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isQuizPage = location.pathname === "/quiz";

  const headerBgClass = isQuizPage ? "bg-white shadow-md" : "bg-transparent";
  const textColorClass = isQuizPage ? "text-primary-green" : "text-white";
  const buttonClass = isQuizPage
    ? "bg-primary-green text-white hover:bg-primary-green/80"
    : "bg-primary-green text-white hover:bg-white hover:text-primary-green";

  return (
    <header className={`${headerBgClass} p-5 absolute w-full z-20`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold ${textColorClass}`}>
          Quiz Master
        </Link>

        <nav className={`flex items-center space-x-6 ${textColorClass}`}>
          <Link to="/quiz">Quiz</Link>

          {user.isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="hidden md:block">Welcome, {user.username}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className={`${buttonClass} px-4 py-2 rounded-sm cursor-pointer duration-300`}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className={`${buttonClass} px-4 py-2 rounded font-medium transition`}
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
