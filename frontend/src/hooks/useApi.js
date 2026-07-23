import { useEffect, useState } from 'react';
export const useApi = (fetchFn, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let isMounted = true;
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await fetchFn();
                if (isMounted) {
                    setData(response.data);
                    setError(null);
                }
            }
            catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('Unknown error'));
                }
            }
            finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetch();
        return () => {
            isMounted = false;
        };
    }, dependencies);
    return { data, loading, error };
};
