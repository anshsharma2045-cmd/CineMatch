function MovieCard({ title, genre, rating, poster }) {
  return (
    <div className={`movie-card ${poster ? 'has-poster' : ''}`}>

      {poster && (
        <img
          src={poster}
          alt={`${title} poster`}
          className="movie-poster"
        />
      )}

      <h3>{title}</h3>
      <p>🎭 {genre}</p>
      <p>⭐ {rating}/10</p>

    </div>
  )
}

export default MovieCard