import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"

export default function useURLState(param, defaultValue, replace = true) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const value = searchParams.get(param) || defaultValue

    function setValue(value) {
        const newParams = new URLSearchParams(searchParams.toString())
        if (value) newParams.set(param, value)
        else newParams.delete(param)
        const url = router.pathname + '?' + newParams.toString()
        if (replace) router.replace(url)
        else router.push(url)
    }

    return [value, setValue]
}
