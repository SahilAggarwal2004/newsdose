import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default function useURLState(param, defaultValue) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const value = searchParams.get(param) || defaultValue

    function setValue(value) {
        const newParams = new URLSearchParams(searchParams.toString())
        if (value) newParams.set(param, value)
        else newParams.delete(param)
        const url = pathname + '?' + newParams.toString()
        router.replace(url)
    }

    return [value, setValue]
}
