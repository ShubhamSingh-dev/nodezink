"use client";

export function AuthPage({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {isSignedIn ? "Welcome back!" : "Create an account"}
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <button className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 shadow-sm">
            {isSignedIn ? "Sign out" : "Sign in"}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          {isSignedIn ? (
            <p>
              Not you?{" "}
              <a href="signup" className="text-indigo-600 hover:underline">
                Switch account
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <a href="/signin" className="text-indigo-600 hover:underline">
                Log in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
