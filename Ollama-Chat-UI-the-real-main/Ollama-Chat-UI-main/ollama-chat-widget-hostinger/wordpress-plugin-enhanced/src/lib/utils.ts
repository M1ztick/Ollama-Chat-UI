export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function scrollToBottom(element: HTMLElement | null) {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}
