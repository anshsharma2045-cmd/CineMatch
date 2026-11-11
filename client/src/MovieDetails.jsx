
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function MovieDetails() {
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError('')
    setMovie(null)

    fetch(`/api/movies/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load movie details')
        }
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setMovie(data)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load movie details')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <h2 style={{ color: 'white', textAlign: 'center', padding: '60px' }}>
        Loading movie details...
      </h2>
    )
  }

  if (error || !movie) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2 style={{ color: 'white' }}>
          {error || 'Movie not found'}
        </h2>
        <Link to="/" style={{ color: '#ff1744' }}>
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      boxSizing: 'border-box',
      color: 'white'
    }}>

      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        <Link
          to="/"
          style={{
            color: '#ff1744',
            fontSize: '18px',
            textDecoration: 'none'
          }}
        >
          ← Back to Home
        </Link>

        <div style={{
          display: 'flex',
          gap: '35px',
          marginTop: '40px',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>

          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              style={{
                width: '300px',
                maxWidth: '100%',
                borderRadius: '18px',
                objectFit: 'cover',
                boxShadow: '0 12px 35px rgba(0,0,0,0.6)'
              }}
            />
          )}

          <div style={{
            flex: '1 1 350px',
            maxWidth: '750px',
            minWidth: 0,
            background: 'rgba(22, 18, 34, 0.94)',
            border: '1px solid #713545',
            borderRadius: '20px',
            padding: '30px',
            boxSizing: 'border-box',
            boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
            textAlign: 'left',
            lineHeight: '1.8'
          }}>

            <h1 style={{
              color: '#FFFFFF',
              WebkitTextFillColor: '#FFFFFF',
              background: 'none',
              fontSize: 'clamp(28px, 4vw, 44px)',
              textAlign: 'center',
              marginTop: 0,
              marginBottom: '25px',
              overflowWrap: 'anywhere'
            }}>
              {movie.title}
            </h1>

            <p>
              ⭐ Rating: {
                typeof movie.vote_average === 'number' && movie.vote_count > 0
                  ? `${movie.vote_average.toFixed(1)}/10`
                  : 'Not rated yet'
              }
            </p>

            <p>
              📅 Release Date: {movie.release_date || 'Not available'}
            </p>

            <p>
              🎭 Genres: {
                movie.genres?.length
                  ? movie.genres.map((genre) => genre.name).join(', ')
                  : 'Not available'
              }
            </p>

            <h2 style={{
              color: '#FFFFFF',
              marginTop: '25px',
              marginBottom: '12px',
              fontSize: '28px'
            }}>
              Story
            </h2>

            <p style={{
              color: '#f0edf5',
              fontSize: '17px',
              lineHeight: '1.9',
              overflowWrap: 'break-word'
            }}>
              {movie.overview || 'Story not available'}
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
