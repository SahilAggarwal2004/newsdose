/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const objectify = search => Object.fromEntries(new URLSearchParams(search).entries())

export default function SearchLink({ children, href, search, preserve = ['query', 'date'], ...props }) {
    const paramString = useSearchParams().toString()
    const query = useMemo(() => {
        if (search && typeof search === 'string') search = objectify(search)
        if (preserve) {
            var paramObj = objectify(paramString)
            if (Array.isArray(preserve)) {
                const filtered = Object.keys(paramObj).filter(key => preserve.includes(key)).reduce((obj, key) => {
                    obj[key] = paramObj[key];
                    return obj;
                }, {});
                paramObj = filtered
            }
        }
        return { ...paramObj, ...search }
    }, [paramString])

    return <Link {...props} href={{ pathname: href, query }} prefetch={false}>{children}</Link>
}