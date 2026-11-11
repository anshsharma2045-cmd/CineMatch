import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SearchResults from './SearchResults.jsx'
import MovieDetails from './MovieDetails.jsx'

import Signup from './signup.jsx'
import Login from './login.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
  
<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/movie/:id" element={<MovieDetails />} />
  </Routes>-
</BrowserRouter>
  
  </StrictMode>,
)
