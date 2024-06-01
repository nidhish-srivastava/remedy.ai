import {  clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function getCookie(){
  return document.cookie.split("accessToken=")[1].split(";")[0];
}