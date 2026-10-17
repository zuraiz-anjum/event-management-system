import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<ComingSoon title="Events" />} />
        <Route path="upcoming" element={<ComingSoon title="Upcoming events" />} />
        <Route path="categories" element={<ComingSoon title="Categories" />} />
        <Route path="events/:id" element={<ComingSoon title="Event details" />} />
        <Route path="my-events" element={<ComingSoon title="My Events" />} />
        <Route path="login" element={<ComingSoon title="Log in" />} />
        <Route path="register" element={<ComingSoon title="Create account" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
