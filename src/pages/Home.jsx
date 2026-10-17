import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="hero">
      <h1>Find your next event</h1>
      <p>Browse concerts, sports and shows, register and keep track of them in one place.</p>
      <Link to="/events" className="btn btn-primary">
        Browse events
      </Link>
    </section>
  )
}
