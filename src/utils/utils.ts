export function stopPropagate(callback: () => void) {
  return (e: { stopPropagation: () => void; preventDefault: () => void }) => {
    e.preventDefault()
    callback()
    e.stopPropagation()
  }
}
