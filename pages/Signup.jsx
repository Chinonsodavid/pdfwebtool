import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ name, email, password })
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
            Create your workspace.
          </h1>

          <p className="text-orange-100 text-lg leading-relaxed">
            Join ConstantPDF and access powerful PDF tools with a fast modern workflow.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="text-orange-100">Unlimited productivity</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="text-orange-100">Secure cloud processing</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p className="text-orange-100">Easy drag & drop workflow</p>
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
              Create account
            </h2>

            <p className="text-[var(--text-muted)] mt-2">
              Start using ConstantPDF today
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
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

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

            <button
              type="submit"
              className="w-full bg-[var(--accent)] text-white rounded-xl py-3 font-semibold hover:bg-[var(--accent-hover)] transition"
            >
              Create Account
            </button>

          </form>

          <p className="text-center text-[var(--text-muted)] mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[var(--accent)] font-semibold"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
