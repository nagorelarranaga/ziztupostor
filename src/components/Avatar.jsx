import { useState } from 'react'

export default function Avatar({ name, i = 0, img, big = false }) {
  const [err, setErr] = useState(false)
  if (img && !err) {
    return (
      <img
        className={`avatar photo ${big ? 'big' : ''}`}
        src={img}
        alt={name}
        onError={() => setErr(true)}
      />
    )
  }
  return (
    <span className={`avatar ${big ? 'big' : ''}`} style={{ '--h': (i * 47) % 360 }}>
      {name[0]?.toUpperCase()}
    </span>
  )
}
