import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ email, password })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--bg)]">

      <div className="hidden lg:flex flex-col justify-between bg-[var(--accent)] text-white p-14">
        <div>
          <Link to="/" className="text-2xl font-bold tracking-tight">
            ConstantPDF
          </Link>
        </div>

        <div className="max-w-md">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Work with PDFs faster.
          </h1>

          <p className="text-orange-100 text-lg leading-relaxed">
            Merge, compress, convert and edit PDFs with a fast modern workflow built for creators and teams.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="text-orange-100">Fast cloud processing</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="text-orange-100">Secure file handling</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="text-orange-100">Simple drag & drop tools</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-orange-100/70">
          © 2026 ConstantPDF
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-[var(--text)]">
              Welcome back
            </h2>

            <p className="text-[var(--text-muted)] mt-2">
              Login to continue using ConstantPDF
            </p>
          </div>

          <button
            className="w-full border border-[var(--border)] rounded-xl py-3 font-medium hover:bg-[var(--bg-subtle)] transition mb-4"
          >
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]"></div>
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="bg-[var(--bg)] px-4 text-[var(--text-muted)]">
                OR
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-[var(--text)] block mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)] block mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--accent)] text-white rounded-xl py-3 font-semibold hover:bg-[var(--accent-hover)] transition"
            >
              Login
            </button>

          </form>

          <p className="text-center text-[var(--text-muted)] mt-6">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-[var(--accent)] font-semibold"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
