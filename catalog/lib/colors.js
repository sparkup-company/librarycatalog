function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? { r: parseInt(r[1],16), g: parseInt(r[2],16), b: parseInt(r[3],16) } : {r:0,g:0,b:0}
}

function mixWhite(hex, t) { // t=1 → white
  const {r,g,b} = hexToRgb(hex)
  const m = c => Math.round(c + (255-c)*t)
  return '#' + [m(r),m(g),m(b)].map(n=>n.toString(16).padStart(2,'0')).join('')
}

function mixBlack(hex, t) { // t=1 → black
  const {r,g,b} = hexToRgb(hex)
  const m = c => Math.round(c*(1-t))
  return '#' + [m(r),m(g),m(b)].map(n=>n.toString(16).padStart(2,'0')).join('')
}

export function buildCssVars(colors) {
  const p = colors.primary
  const {r,g,b} = hexToRgb(p)
  const pl = colors.primaryLight ?? mixWhite(p, 0.82)
  const {r:rl,g:gl,b:bl} = hexToRgb(pl)

  return {
    '--primary':               p,
    '--primary-light':         pl,
    '--primary-dark':          colors.primaryDark  ?? mixBlack(p, 0.18),
    '--primary-shadow':        `rgba(${r},${g},${b},0.2)`,
    '--primary-shadow-strong': `rgba(${r},${g},${b},0.3)`,
    '--primary-light-alpha':   `rgba(${rl},${gl},${bl},0.5)`,
    '--black':    colors.black   ?? '#130f1e',
    '--white':    colors.white   ?? '#faf9fd',
    '--gray-100': colors.gray100 ?? '#f4f2fb',
    '--gray-mid': colors.grayMid ?? '#a89fba',
    '--text-mid': colors.textMid ?? '#4a4358',
    '--border':   colors.border  ?? '#e3dff0',
  }
}
