export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
