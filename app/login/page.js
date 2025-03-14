"use client";

import { useState, useEffect } from "react";
import { useSessionContext } from "../components/SessionWrapper";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const { session, login, loading } = useSessionContext(); // Use `login()` instead of `signIn()`
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && session) {
      setTimeout(() => router.push("/dashboard"), 2000); // Redirect after login
    }
  }, [session, loading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password); // Use `login()` from SessionWrapper
    if (result.error) {
      setError(result.error);
    }
  };

  if (loading) return <p className="text-center text-xl mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
        {session ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.email}!</h1>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
