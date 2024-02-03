import { useState, useEffect } from "react";

const KEY = "f915a37a";

export function useMovies(query, callback) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        callback?.();
        
        const controller = new AbortController();
        
        const fetchMovie = async () => {
          try {
            setIsLoading(true);
            setError('');
    
            const res = await fetch(
              `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`, 
              { signal: controller.signal }
            )
            if(!res.ok) throw new Error('Something went wrong with fetching movies');
    
            const data = await res.json();
            if(data.Response === "False") throw new Error ('Movie not found');
    
            setMovies(data.Search);
            setError('');
            
          } catch (err) {
            if(err.name !== 'AbortError'){
              setError(err.message);
              console.log(err.message);
            }
            
          } finally {
            setIsLoading(false);
          }
    
          if(query.length < 3) {
            setMovies([]);
            setError('');
            return;
          }
    
        }
        // handleCloseMovie();
        fetchMovie();
    
        return function () {
          controller.abort();
        }
    }, [query]);

    return {movies, isLoading, error}
}