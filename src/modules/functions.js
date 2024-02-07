import { sign } from "jssign"
import { getStorage } from "@/modules/storage"

const getTime = Date.now

export const genToken = () => sign(getTime(), process.env.NEXT_PUBLIC_SECRET)

export function getFirstUrl(key, page) {
    const data = getStorage(key, undefined, key[0] === 'news')
    return data?.pages[Math.max(0, (page - 1))]?.news?.[0].url
}

export function includes({ title, description, source }, substring) {
    substring = substring.toLowerCase()
    return [title, description, source].some(item => item?.toLowerCase().includes(substring))
}