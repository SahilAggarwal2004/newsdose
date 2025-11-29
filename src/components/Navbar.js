/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ReactSelect from "react-select";
import LoadingBar from "react-top-loading-bar";
import { countries as importedCountries, categories, pseudoCategories } from "@/constants";
import { useNewsContext } from "@/contexts/ContextProvider";
import { getStorage, setStorage } from "@/modules/storage";
import SearchLink from "@/components/SearchLink";

export default function Navbar() {
  const {
    country: { method, code },
    setCountry,
    pending,
    setPending,
    progress,
    setProgress,
    queryFn,
  } = useNewsContext();
  const client = useQueryClient();
  const [width, setWidth] = useState(window.outerWidth);
  const country = importedCountries[code];
  const countries = useMemo(() => ({ ...importedCountries, auto: "Auto" + (method === "auto" && country ? ` (${country})` : "") }), [method, code]);
  const options = useMemo(() => Object.entries(countries).reduce((arr, [value, label]) => arr.concat({ value, label }), []), [countries]);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.outerWidth));
  }, []);

  function updateCountry({ value }) {
    if (value === "auto") setPending(true);
    else setCountry({ method: "", code: value });
  }

  async function prefetch(category) {
    const queryKey = ["news", code, category];
    if (getStorage(queryKey, undefined, false)) return;
    await client.prefetchInfiniteQuery({ queryKey, retry: 0, enabled: !pending, queryFn });
    const data = client.getQueryData(queryKey);
    if (data) {
      setStorage(queryKey, data);
      setStorage(queryKey, true, false);
    }
  }

  return (
    <>
      <LoadingBar color="#ff0000" shadow={false} progress={progress} waitingTime={300} onLoaderFinished={() => setProgress(0)} />
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <SearchLink href="/" className="navbar-brand">
            NewsDose
          </SearchLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav d-grid d-lg-flex me-auto mt-2 mb-2 mt-lg-0 mb-lg-0">
              {categories.map((category) => (
                <li className="nav-item text-center" key={category}>
                  <SearchLink href="/" search={category && { category }} className="nav-link d-inline-block px-1" aria-current="page" onMouseEnter={() => prefetch(category)}>
                    <button className="btn shadow-none nav-link p-0 text-capitalize" data-bs-toggle="collapse" data-bs-target={width <= 991 && "#navbarSupportedContent"}>
                      {category || "Home"}
                    </button>
                  </SearchLink>
                </li>
              ))}
              {pseudoCategories.map((category) => (
                <li className="nav-item text-center" key={category}>
                  <SearchLink href={`/${category}`} className="nav-link d-inline-block px-1" aria-current="page">
                    <button className="btn shadow-none nav-link p-0 text-capitalize" data-bs-toggle="collapse" data-bs-target={width <= 991 && "#navbarSupportedContent"}>
                      {category}
                    </button>
                  </SearchLink>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-center align-items-center">
              <ReactSelect
                id="countries"
                options={options}
                defaultValue={options[Object.keys(countries).indexOf(method || code)]}
                onChange={updateCountry}
                className="ms-4 me-3"
                isSearchable={false}
              />
              <SearchLink href="/search" className="text-black mb-1">
                <FaSearch title="Search" data-bs-toggle="collapse" data-bs-target={width <= 991 && "#navbarSupportedContent"} />
              </SearchLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
