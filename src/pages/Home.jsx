import About from '../components/About'
import Contact from '../components/Contact'
import Hero from '../components/Hero'
import Skills from '../components/Skills'
import Work from '../components/Work'

export default function Home() {
  return (
    <>
      <Hero />
      <main className="container">
        <About />
        <Work />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
