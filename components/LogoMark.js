export default function LogoMark({ className = "brand__mark", ariaLabel = "The Long Island Cleanout Company logo" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 256 256"
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1B1F26" />
          <stop offset="1" stopColor="#343A42" />
        </linearGradient>
      </defs>
      <circle cx="128" cy="128" r="124" fill="url(#logo-g)" />
      <circle cx="128" cy="128" r="108" fill="none" stroke="#69B548" strokeWidth="10" />
      <path
        d="M57 146c16-16 31-31 42-31 19 0 24 17 41 17 18 0 24-17 44-17 15 0 32 15 53 35"
        fill="none"
        stroke="#E3E5E8"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M63 160c14 0 19-6 31-18 7-7 16-14 26-14 14 0 19 10 34 10 16 0 21-10 36-10 11 0 23 5 37 17"
        fill="none"
        stroke="#69B548"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="76" y="165" width="86" height="26" rx="6" fill="#101B2D" />
      <rect x="170" y="168" width="33" height="23" rx="4" fill="#69B548" />
      <circle cx="95" cy="193" r="10" fill="#F3F6F5" />
      <circle cx="175" cy="193" r="10" fill="#F3F6F5" />
      <path d="M89 84l9 9-9 9-9-9zm36 0l9 9-9 9-9-9z" fill="#69B548" />
      <path
        d="M128 75c20 0 36 16 36 36 0 15-9 28-23 34v17h-10v-15h-7v15h-10v-17c-14-6-23-19-23-34 0-20 16-36 37-36zm0 14c-12 0-22 10-22 22 0 11 8 20 18 22v14h8v-14c10-2 18-11 18-22 0-12-10-22-22-22z"
        fill="#F3F6F5"
      />
    </svg>
  );
}
