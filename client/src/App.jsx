import { useState, useEffect } from 'react'
import './App.css'
import MovieCard from './moviecard'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  
 const [movies, setMovies] = useState([])
 const [searchQuery, setSearchQuery] = useState('')
 const [searchedMovie, setSearchedMovie] = useState('')
useEffect(() => {
  fetch('/api/movies/popular')
    .then(response => response.json())
    .then(data => {
      setMovies(Array.isArray(data) ? data : [])
      
setSearchedMovie(searchQuery.trim())

    })
    .catch(error => {
      console.error('Error fetching movies:', error)
    })
}, [])

const handleSearch = async () => {
  if (!searchQuery.trim()) return
  
navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)


  try {
    const response = await fetch(
      `/api/movies/search?query=${encodeURIComponent(searchQuery)}`
    )

    if (!response.ok) {
      throw new Error('Search failed')
    }

    const data = await response.json()
    setMovies(Array.isArray(data) ? data : [])
  } catch (error) {
    console.error('Search error:', error)
  }
}


  return (
    <div>
     <div className="hero">
      
<h1 className="cinematch-title">
  <svg
    className="cinematch-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 11h16v9H4z" />
    <path d="m3 6 16-3 1 5-16 3z" />
    <path d="m7 5 3 5" />
    <path d="m13 4 3 5" />
  </svg>
  CineMatch
</h1>

      <p>Discover movies you'll love!</p>

      
<input
  type="text"
  placeholder="Search for a movie..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}

onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
/>
      
<button onClick={handleSearch}>Search</button>

        </div>  {/* Hero section closed */}

      <section className="movies-section">
      
<h2>{searchedMovie ? `🔍 Search Results for "${searchedMovie}"` : '🎥 Popular Movies'}</h2>


        <div className="movie-grid">
          <MovieCard
            title="Interstellar"
            genre="Sci-Fi"
            rating={8.7}
            poster="/posters/interstellar.jpg"
          />

          <MovieCard
            title="Inception"
            genre="Sci-Fi / Thriller"
            rating={8.8}
            poster="/posters/inception.jpg"
          />

          <MovieCard
            title="The Dark Knight"
            genre="Action / Crime"
            rating={9.0}
            poster="/posters/dark-knight.jpg"
          />
          

        </div>
      </section>
    </div>
  )
}

export default App
