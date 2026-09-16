function BrandMark({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="20" r="3.5" fill="#FF5A36" />
      <path
        d="M20 10c5.523 0 10 4.477 10 10s-4.477 10-10 10"
        stroke="#FF5A36"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M20 3c9.389 0 17 7.611 17 17s-7.611 17-17 17"
        stroke="#FF5A36"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export default BrandMark;
