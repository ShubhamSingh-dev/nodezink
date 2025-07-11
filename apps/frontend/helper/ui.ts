export function lockUI(lock : boolean) {
  if (lock) return document.body.classList.add("lock-ui");
  document.body.classList.remove("lock-ui");
}