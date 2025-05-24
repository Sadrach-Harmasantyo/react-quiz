import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginSchema, registerSchema } from "../schema";
import { z } from "zod";
import type { User } from "../types";

export default function Login() {
  // State untuk toggle antara mode login dan register
  const [isLogin, setIsLogin] = useState(true);
  
  // State untuk form input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State untuk menangani error dan pesan sukses
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Ambil fungsi login dari auth store dan navigate untuk routing
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Handler submit form login/register
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset pesan error setiap kali submit
    setError("");
    setValidationErrors({});

    try {
      if (isLogin) {
        // Validasi input login menggunakan Zod schema
        loginSchema.parse({ email, password });
      } else {
        // Validasi input register menggunakan Zod schema
        registerSchema.parse({ username, email, password, confirmPassword });
      }

      // Jika validasi berhasil
      if (!isLogin) {
        // Logika registrasi
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Cek apakah email sudah terdaftar
        if (users.some((user: User) => user.email === email)) {
          setError("Email already registered");
          return;
        }

        // Simpan user baru ke localStorage
        users.push({ username, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        // Pindah ke mode login setelah registrasi berhasil
        setIsLogin(true);
        setSuccessMessage("Registration successful! Please login.");
        return;
      }

      // Logika login
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      // Cari user dengan email dan password yang sesuai
      const user = users.find(
        (u: User) => u.email === email && u.password === password
      );

      if (user) {
        // Jika user ditemukan, set state login dan redirect ke halaman quiz
        login(user.username);
        navigate("/quiz");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Konversi error validasi Zod ke format yang lebih mudah digunakan
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path) {
            errors[error.path[0]] = error.message;
          }
        });
        setValidationErrors(errors);
      } else {
        setError("An unexpected error occurred");
        console.error(err);
      }
    }
  };

  // Helper function untuk mendapatkan pesan error validasi
  const getFieldError = (field: string) => {
    return validationErrors[field] || "";
  };

  return (
    <div className="min-h-screen flex">
      {/* Bagian kiri - Gambar background (hanya tampil di desktop) */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
          alt="Quiz background"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6">
          <Link to="/" className="text-white text-2xl font-bold">
            Quiz Master
          </Link>
        </div>
        <div className="absolute bottom-10 left-10 text-white max-w-xs">
          <h2 className="text-3xl font-bold mb-3">Test Your Knowledge</h2>
          <p className="text-white text-opacity-90">
            Challenge yourself with our interactive quizzes and see how much you
            know!
          </p>
        </div>
      </div>

      {/* Bagian kanan - Form login/register */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo untuk tampilan mobile */}
          <div className="md:hidden mb-8">
            <Link to="/" className="text-[#29ab00] text-2xl font-bold">
              Quiz Master
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Tampilkan pesan error jika ada */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Tampilkan pesan sukses jika ada */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {successMessage}
              </div>
            )}

            {/* Field username hanya tampil di mode register */}
            {!isLogin && (
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full p-3 border ${
                    getFieldError("username")
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-[#29ab00]`}
                  placeholder="Enter your username"
                />
                {getFieldError("username") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("username")}
                  </p>
                )}
              </div>
            )}

            {/* Field email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 mb-2 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 border ${
                  getFieldError("email") ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 focus:ring-[#29ab00]`}
                placeholder="Enter your email"
              />
              {getFieldError("email") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("email")}
                </p>
              )}
            </div>

            {/* Field password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 mb-2 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 border ${
                  getFieldError("password")
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 focus:ring-[#29ab00]`}
                placeholder="Enter your password"
              />
              {getFieldError("password") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("password")}
                </p>
              )}
            </div>

            {/* Field confirm password hanya tampil di mode register */}
            {!isLogin && (
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 border ${
                    getFieldError("confirmPassword")
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-[#29ab00]`}
                  placeholder="Confirm your password"
                />
                {getFieldError("confirmPassword") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("confirmPassword")}
                  </p>
                )}
              </div>
            )}

            {/* Tombol submit */}
            <button
              type="submit"
              className="w-full bg-[#29ab00] hover:opacity-80 text-white py-3 rounded-lg font-semibold transition duration-300 cursor-pointer mb-4"
            >
              {isLogin ? "Login" : "Register"}
            </button>

            {/* Toggle antara mode login dan register */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setValidationErrors({});
                }}
                className="text-[#29ab00] hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
