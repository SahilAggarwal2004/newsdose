import { useState, useEffect } from "react";
import { getStorage, setStorage } from "./modules/storage";

export function useStorage(key, initialValue, local = true) {
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") return initialValue
        return getStorage(key, initialValue, local)
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = value => {
        setStoredValue(value);
        if (typeof window !== "undefined") setStorage(key, value, local)
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