import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import { clearAuthError, loginUser } from '../features/auth/authSlice.js'
import { showToast } from '../features/toast/toastSlice.js'
import { hasErrors, validateEmail } from '../utils/validation.js'

export default function Login() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { status, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})


  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const found = {
      email: validateEmail(form.email),
      password: form.password ? '' : 'Password is required.',
    }
    setErrors(found)
    if (hasErrors(found)) return

    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      dispatch(showToast(`Welcome back, ${result.payload.name}.`, 'success'))
    }
  }

  return (
    <section className="auth-card">
      <h1>Log in</h1>
      {location.state?.needsLogin && (
        <p className="notice">Please log in to continue.</p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        {status === 'failed' && error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary btn-block" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="auth-switch">
        New here? <Link to="/register" state={location.state}>Create an account</Link>
      </p>
    </section>
  )
}
