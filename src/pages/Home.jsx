import About from '../components/About'
import Contact from '../components/Contact'
import DotGrid from '../components/DotGrid'
import Experience from '../components/Experience'
import Hero from '../components/Hero'
import Skills from '../components/Skills'
import Work from '../components/Work'

// Nav and Footer live in App so every route (including project pages) has them.
export default function Home() {
  return (
    <>
      <DotGrid />
      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
