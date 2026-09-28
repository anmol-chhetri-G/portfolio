import { Link, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Nav from './components/Nav'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'

export default function App() {
  return (
    <div className="app">
      <ScrollManager />
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route
          path="*"
          element={
            <main className="container page">
              <h1>Page not found</h1>
              <Link className="button button--primary" to="/">
                Back home
              </Link>
            </main>
          }
        />
      </Routes>

      <Footer />
    </div>
  )
}
