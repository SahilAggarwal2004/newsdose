/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function SearchLink({ children, href, search, preserve = ['query', 'date'], ...props }) {
    const searchParams = useSearchParams()
    const paramString = searchParams.toString()
    const query = useMemo(() => {
        if (search) var searchObj = Object.fromEntries(new URLSearchParams(search).entries())
        if (preserve) {
            var paramObj = Object.fromEntries(new URLSearchParams(paramString).entries())
            if (Array.isArray(preserve)) {
                const filtered = Object.keys(paramObj).filter(key => preserve.includes(key)).reduce((obj, key) => {
                    obj[key] = paramObj[key];
                    return obj;
                }, {});
                paramObj = filtered
            }
        }
        return { ...paramObj, ...searchObj }
    }, [paramString])

    return <Link {...props} href={{ pathname: href, query }}>{children}</Link>
}