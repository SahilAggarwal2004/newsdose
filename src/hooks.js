import { useState, useEffect } from "react";

export function useStorage(key, initialValue, options = { local: true, session: false }) {
    const { local, session } = options

    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") return initialValue
        let item;
        if (session) item = sessionStorage.getItem(key);
        else if (local) item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = value => {
        setStoredValue(value);
        if (typeof window !== "undefined") {
            if (local) localStorage.setItem(key, JSON.stringify(value))
            if (session) sessionStorage.setItem(key, JSON.stringify(value))
        }
    };
    return [storedValue, setValue];
}

export function useDebounce(value, delay = 800) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => { clearTimeout(handler) }
    }, [value, delay])
    return debouncedValue
}