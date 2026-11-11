import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import MovieCard from './moviecard'
function SearchResults() {
    
const [searchParams] = useSearchParams()
const query = searchParams.get('q') || ''
const [movies, setMovies] = useState([])

useEffect(() => {
  if (!query.trim()) return

  fetch(`/api/movies/search?query=${encodeURIComponent(query)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }
      return response.json()
    })
    .then(data => {
      setMovies(Array.isArray(data) ? data : [])
    })
    .catch(error => {
      console.error('Search error:', error)
    })
}, [query])

  return (
    <div>
  

<a href="/" style={{ color: 'white', display: 'inline-block', marginBottom: '20px' }}>← Back to Home</a>

<form action="/search" method="get" className="search-bar">
  <input
    type="text"
    name="q"
    placeholder="Search another movie..."
    defaultValue={query}
  />
  <button type="submit">Search</button>
</form>

  
<div className="movie-grid">
  

{movies.filter(movie => movie.poster_path).map((movie) => (
  <Link
    key={movie.id}
    to={`/movie/${movie.id}`}
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <MovieCard
      title={movie.title}
      genre="Movie"
      rating={movie.vote_average?.toFixed(1)}
      poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
    />
  </Link>
))}

</div>

    </div>
  )
}

export default SearchResults
