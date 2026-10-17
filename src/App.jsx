import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { GuestOnly, RequireAuth } from './components/RouteGuards.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Register from './pages/Register.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<ComingSoon title="Events" />} />
        <Route path="upcoming" element={<ComingSoon title="Upcoming events" />} />
        <Route path="categories" element={<ComingSoon title="Categories" />} />
        <Route path="events/:id" element={<ComingSoon title="Event details" />} />

        <Route element={<RequireAuth />}>
          <Route path="my-events" element={<ComingSoon title="My Events" />} />
        </Route>

        <Route element={<GuestOnly />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
