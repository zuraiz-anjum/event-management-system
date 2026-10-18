import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { GuestOnly, RequireAuth } from './components/RouteGuards.jsx'
import Categories from './pages/Categories.jsx'
import EventDetails from './pages/EventDetails.jsx'
import Events from './pages/Events.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import MyEvents from './pages/MyEvents.jsx'
import NotFound from './pages/NotFound.jsx'
import Register from './pages/Register.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events mode="all" />} />
        <Route path="upcoming" element={<Events mode="upcoming" />} />
        <Route path="categories" element={<Categories />} />
        <Route path="events/:id" element={<EventDetails />} />

        <Route element={<RequireAuth />}>
          <Route path="my-events" element={<MyEvents />} />
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
