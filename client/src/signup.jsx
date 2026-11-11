
import { useState } from 'react'

function Signup() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Signup button clicked')
    const form = e.currentTarget
    const formData = new FormData(form)

    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      setMessage('Account created successfully!')
      form.reset()

    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <h2>Create Your CineMatch Account 🎬</h2>

      
<form onSubmit={handleSubmit} noValidate>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          minLength={8}
          required
        />

        
<button type="submit" disabled={loading}>

          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </div>
  )
}

export default Signup
