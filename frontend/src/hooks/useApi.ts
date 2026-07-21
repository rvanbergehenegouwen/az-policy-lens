import { useEffect, useState } from 'react'

export const useApi = <T,>(
  fetchFn: () => Promise<any>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetch = async () => {
      try {
        setLoading(true)
        const response = await fetchFn()
        if (isMounted) {
          setData(response.data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetch()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return { data, loading, error }
}
