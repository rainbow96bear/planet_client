import { writable } from 'svelte/store';

const initial = typeof window !== "undefined"
  ? localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  : "light";

export const theme = writable(initial);

theme.subscribe((value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", value);
    document.body.classList.toggle("dark", value === "dark");
  }
});
