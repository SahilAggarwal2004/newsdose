import { sign } from "jssign";
import { getStorage } from "@/modules/storage";

const formatDate = (date) => date.toISOString().split("T")[0];

export const genToken = () => sign(Date.now(), process.env.NEXT_PUBLIC_SECRET);

export function getDateRange(monthsBack = 1) {
  const today = new Date();
  const past = new Date(today);
  past.setMonth(today.getMonth() - monthsBack);
  return { min: formatDate(past), max: formatDate(today) };
}

export function getFirstUrl(key, page) {
  const data = getStorage(key, undefined, key[0] === "news");
  return data?.pages[Math.max(0, page - 1)]?.news?.[0].url;
}

export function includes({ title, description, source }, substring) {
  substring = substring.toLowerCase();
  return [title, description, source].some((item) => item?.toLowerCase().includes(substring));
}
