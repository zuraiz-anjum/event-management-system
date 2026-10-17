import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import { clearAuthError, registerUser } from '../features/auth/authSlice.js'
import { showToast } from '../features/toast/toastSlice.js'
import {
  hasErrors,
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validation.js'

export default function Register() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { status, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
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
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
    }
    setErrors(found)
    if (hasErrors(found)) return

    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) {
      dispatch(showToast('Account created. You are now logged in.', 'success'))
    }
  }

  return (
    <section className="auth-card">
      <h1>Create account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="name"
          name="name"
          label="Name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
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
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormField
          id="confirm"
          name="confirm"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
        />
        {status === 'failed' && error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary btn-block" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login" state={location.state}>Log in</Link>
      </p>
    </section>
  )
}
