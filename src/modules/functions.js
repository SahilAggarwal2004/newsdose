import { getStorage } from "./storage"

export const getFirstUrl = (key, page) => {
    const data = getStorage(key, undefined, key[0] === 'news')
    return data?.pages[Math.max(0, (page - 1))]?.news?.[0].url
}