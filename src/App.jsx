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
            <main className="shell detail">
              <div className="kicker">404</div>
              <h1>Page not found</h1>
              <div className="cta-row">
                <Link className="btn btn-primary" to="/">
                  Back home
                </Link>
              </div>
            </main>
          }
        />
      </Routes>

      <Footer />
    </div>
  )
}
