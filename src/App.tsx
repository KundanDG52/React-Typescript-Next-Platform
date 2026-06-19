import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Fundamentals } from './pages/Fundamentals'
import { Hooks } from './pages/Hooks'
import { Performance } from './pages/Performance'
import { Patterns } from './pages/Patterns'
import { Internals } from './pages/Internals'
import { TypeScriptTrack } from './pages/TypeScript'
import { NextjsTrack } from './pages/Nextjs'
import { Puzzles } from './pages/Puzzles'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fundamentals" element={<Fundamentals />} />
          <Route path="/hooks" element={<Hooks />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/internals" element={<Internals />} />
          <Route path="/typescript" element={<TypeScriptTrack />} />
          <Route path="/nextjs" element={<NextjsTrack />} />
          <Route path="/puzzles" element={<Puzzles />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
