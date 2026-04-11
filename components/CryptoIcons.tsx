'use client';

export const LTCIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#2C3E50" stroke="#7B8BA3" strokeWidth="3" />
    <path d="M28 22L36 42M36 22L28 42" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const USDTIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#26A17B" stroke="#4FCFA0" strokeWidth="3" />
    <path d="M32 16V20M32 44V48" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <rect x="20" y="26" width="24" height="12" rx="2" fill="white" />
    <path d="M20 32C16 32 14 35 14 38C14 41 16 44 20 44H44C48 44 50 41 50 38C50 35 48 32 44 32" stroke="white" strokeWidth="2" />
  </svg>
);

export const SOLIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#2C2E48" stroke="#5A5F7E" strokeWidth="3" />
    <path d="M18 24L26 32L18 40M26 24L34 32L26 40M34 24L42 32L34 40" stroke="#14F195" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BNBIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#2C2C2C" stroke="#4A4A4A" strokeWidth="3" />
    <rect x="22" y="22" width="8" height="8" fill="#F3BA2F" />
    <rect x="34" y="22" width="8" height="8" fill="#F3BA2F" />
    <rect x="28" y="28" width="8" height="8" fill="#F3BA2F" />
    <rect x="22" y="34" width="8" height="8" fill="#F3BA2F" />
    <rect x="34" y="34" width="8" height="8" fill="#F3BA2F" />
  </svg>
);
