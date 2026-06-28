export function MercadoLivreLogo() {
  return (
    <div className="flex items-center gap-2">
      <HandshakeIcon />
      <div className="leading-[1.1]">
        <span className="block text-[15px] font-bold text-gray-800 tracking-tight">
          mercado
        </span>
        <span className="block text-[15px] font-bold text-gray-800 tracking-tight">
          livre
        </span>
      </div>
    </div>
  )
}

function HandshakeIcon() {
  return (
    <svg
      viewBox="0 0 54 54"
      className="w-12 h-12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="27" cy="27" rx="27" ry="27" fill="#FFE600" />
      <path
        d="M14 28c0-1.1.9-2 2-2h4l3-4h8l3 4h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2v-6Z"
        fill="#3483FA"
      />
      <path
        d="M21 26l2-3h8l2 3"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="21" cy="31" r="2" fill="#fff" />
      <circle cx="33" cy="31" r="2" fill="#fff" />
    </svg>
  )
}
