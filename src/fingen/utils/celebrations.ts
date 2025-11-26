export function confettiBurst() {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.inset = '0'
  container.style.pointerEvents = 'none'
  container.style.zIndex = '9999'
  document.body.appendChild(container)

  const colors = ['#A78BFA','#22D3EE','#34D399','#F59E0B','#FB7185']
  const pieces = 40
  for (let i = 0; i < pieces; i++) {
    const p = document.createElement('div')
    p.style.position = 'absolute'
    p.style.width = '8px'
    p.style.height = '14px'
    p.style.borderRadius = '3px'
    p.style.background = colors[Math.floor(Math.random() * colors.length)]
    p.style.left = Math.random() * 100 + 'vw'
    p.style.top = '-10px'
    p.style.transform = `rotate(${Math.random() * 360}deg)`
    p.style.opacity = '0.9'
    const duration = 1200 + Math.random() * 600
    p.style.transition = `transform ${duration}ms cubic-bezier(0.22,1,0.36,1), top ${duration}ms ease, opacity ${duration}ms ease`
    container.appendChild(p)
    requestAnimationFrame(() => {
      p.style.top = '90vh'
      p.style.transform = `translateX(${(Math.random() - 0.5) * 120}px) rotate(${Math.random() * 720}deg)`
      p.style.opacity = '1'
    })
  }
  setTimeout(() => {
    container.remove()
  }, 2200)
}