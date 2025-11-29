/* eslint-disable @next/next/no-img-element */
import { useMemo } from "react";
import Speech, { HighlightedText } from "react-text-to-speech";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaShareAlt } from "react-icons/fa";
import { HiVolumeOff } from "react-icons/hi";
import Bookmark from "@/components/Bookmark";
import { useNewsContext } from "@/contexts/ContextProvider";
import { imageFallback } from "@/constants";

export default function NewsItem(props) {
  const { title, description, urlToImage, url, publishedAt, source, dateFormat, index } = props;
  const { setShareUrl } = useNewsContext();
  const date = dateFormat === "UTC" ? new Date(publishedAt).toUTCString() : new Date(publishedAt).toLocaleString();
  const connectionSpeed = navigator.connection?.effectiveType;
  const backupImg = imageFallback[index];
  const imgUrl =
    urlToImage?.match(/http/g)?.length !== 1
      ? backupImg
      : `https://wsrv.nl/?url=${urlToImage}&width=450&height=300&maxage=1d&output=webp&q=${connectionSpeed?.includes("2") ? 5 : connectionSpeed?.includes("3") ? 10 : 25}`;
  const text = useMemo(
    () => (
      <>
        <a href={url} target="_blank" rel="noreferrer" className="text-black text-decoration-none">
          <h5 className="card-title">{title}</h5>
        </a>
        <span className="d-none">.</span>
        <hr />
        <p className="card-text">{description}</p>
      </>
    ),
    [title, description, url]
  );

  return (
    <div className="card mt-4 mb-3 w-100" style={{ paddingBottom: "2rem" }}>
      <span className="position-absolute text-capitalize top-0 start-50 translate-middle badge rounded-pill bg-danger border">{source}</span>
      <a href={url} target="_blank" rel="noreferrer" className="text-black">
        <div style={{ height: "13rem" }}>
          <img src={imgUrl} onError={(event) => (event.target.src = backupImg)} loading="lazy" className="card-img-top h-100" alt="" />
        </div>
      </a>
      <div className="card-body">
        <hr />
        <HighlightedText id={url} />
        <p className="card-text mt-2">
          <small className="text-muted">Published on {date}</small>
        </p>
        <div className="position-absolute d-flex align-items-center m-1" style={{ bottom: "1rem" }}>
          <span className="scale me-3 p-1">
            <Speech id={url} text={text} useStopOverPause highlightText lang={navigator.language} stopBtn={<HiVolumeOff size="1.25rem" />} />
          </span>
          <span className="scale me-3 p-1">
            <Bookmark {...props} />
          </span>
          <span className="scale me-3 p-1">
            <FaShareAlt role="button" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setShareUrl(url)} />
          </span>
          <a href={url} target="_blank" rel="noreferrer" className="text-black scale p-1">
            <BsFillInfoSquareFill />
          </a>
        </div>
      </div>
    </div>
  );
}
