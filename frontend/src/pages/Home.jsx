import React, { useEffect, useState } from 'react'
import api from '../api'
import VideoCard from '../components/VideoCard'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home(){
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
      try {
        const res = await api.get('/videos')
        const list = res?.data?.data?.videos || res?.data?.videos || []
        setVideos(list)
        // If no published videos are returned but the user is logged in, redirect to My Videos
        // where the user can manage their uploads (useful when uploads aren't appearing on Home)
        if ((list.length === 0) && user) {
          navigate('/my-videos')
        }
      } catch (err) {
        // show friendly message and attempt a fallback detailed fetch to help debugging
        const msg = err?.response?.data?.message || err.message || String(err)
        setError(msg)

        // fallback: try calling the API directly with fetch and Authorization header (helps when CORS/cookies are the issue)
        try {
          const API_BASE = import.meta.env.VITE_API_URL
          const token = localStorage.getItem('accessToken')
          const fallbackRes = await fetch(`${API_BASE}/api/v1/videos?page=1&limit=50`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          })
          const text = await fallbackRes.text()
          console.debug('Fallback /videos response:', fallbackRes.status, text)
        } catch (fallbackErr) {
          console.debug('Fallback fetch failed', fallbackErr)
        }
      } finally {
        setLoading(false)
      }
    }

    // wait for auth to finish. If user is present, fetch videos.
    if (!authLoading && user) {
      fetchVideos()
    }
    // if auth finished and no user, do not fetch (videos API is protected on backend)
  }, [authLoading, user])

  if (authLoading) return <p>Checking authentication...</p>

  if (!user) {
    return (
      <section className="home-section">
        <h2>Latest videos</h2>
        <p>
          You need to <Link to="/login">log in</Link> to see videos.
        </p>
      </section>
    )
  }

  return (
    <section className="home-section">
      <h2>Latest videos</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="home-error">Error: {error}</p>}
      <div className="home-list">
        {videos.map(v => (
          <VideoCard key={v._id} video={v} onDeleted={(id) => setVideos(prev => prev.filter(x => x._id !== id))} />
        ))}
      </div>
    </section>
  )
}
