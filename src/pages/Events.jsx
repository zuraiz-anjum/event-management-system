import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import EventFilters from '../components/EventFilters.jsx'
import EventResults from '../components/EventResults.jsx'
import {
  fetchCategories,
  fetchEvents,
  selectCategories,
  selectEventsList,
} from '../features/events/eventsSlice.js'
import useDebouncedValue from '../hooks/useDebouncedValue.js'
import { readFilters, toApiParams } from '../utils/eventQuery.js'

// One page for both "all events" and "upcoming events", the mode changes the date handling.
export default function Events({ mode = 'all' }) {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const list = useSelector(selectEventsList)
  const categories = useSelector(selectCategories)

  const queryString = searchParams.toString()
  const filters = useMemo(() => readFilters(new URLSearchParams(queryString)), [queryString])

  // Wait until typing stops before calling the API.
  const settledQuery = useDebouncedValue(queryString, 450)
  const apiParams = useMemo(
    () => toApiParams(readFilters(new URLSearchParams(settledQuery)), mode),
    [settledQuery, mode],
  )

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchEvents(apiParams))
  }, [dispatch, apiParams])

  const updateParams = (changes, keepPage = false) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(changes).forEach(([name, value]) => {
          if (value === '' || value === null || value === undefined) next.delete(name)
          else next.set(name, String(value))
        })
        if (!keepPage) next.delete('page')
        return next
      },
      { replace: true },
    )
  }

  const handlePageChange = (page) => {
    updateParams({ page: page > 1 ? page : '' }, true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const title = mode === 'upcoming' ? 'Upcoming events' : 'Events'
  const intro =
    mode === 'upcoming'
      ? `What is happening in the next ${filters.days} days.`
      : 'Search the full Ticketmaster listings.'

  return (
    <>
      <div className="page-head">
        <h1>{title}</h1>
        <p className="muted">{intro}</p>
      </div>
      <EventFilters
        filters={filters}
        categories={categories.items}
        mode={mode}
        onChange={updateParams}
        onClear={() => setSearchParams({}, { replace: true })}
      />
      <EventResults
        list={list}
        currentPage={filters.page}
        onPageChange={handlePageChange}
        onRetry={() => dispatch(fetchEvents(apiParams))}
      />
    </>
  )
}
