import React from 'react';

export const GrumpyMascotFace: React.FC<{ size?: number; hasCrown?: boolean }> = ({
  size = 44,
  hasCrown = true,
}) => {
  return (
    <svg
      className="shrink-0"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Crown */}
      {hasCrown && (
        <path
          d="M14 11L18 15L22 10L26 15L30 11L28 17H16L14 11Z"
          fill="#FEA619"
          stroke="#684000"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      )}
      {/* Sweat drop */}
      <path
        d="M35 18C35 18 37 21 37 22.5C37 23.9 35.9 25 34.5 25C33.1 25 32 23.9 32 22.5C32 21 35 18 35 18Z"
        fill="#A3DEFE"
      />
      {/* Furrowed Angry Brows */}
      <path d="M12 21L18 24" stroke="#410004" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 21L26 24" stroke="#410004" strokeWidth="2.2" strokeLinecap="round" />
      {/* Steaming Grumpy Eyes */}
      <circle cx="16" cy="25" r="2.2" fill="#410004" />
      <circle cx="28" cy="25" r="2.2" fill="#410004" />
      {/* Puffed Cheeks Rosy */}
      <ellipse cx="12" cy="29" rx="3" ry="1.5" fill="#FF7A73" opacity="0.6" />
      <ellipse cx="32" cy="29" rx="3" ry="1.5" fill="#FF7A73" opacity="0.6" />
      {/* Sulking downturned mouth */}
      <path
        d="M17 33C19 30 25 30 27 33"
        stroke="#410004"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Steam puff */}
      <path
        d="M7 16Q6 13 8 11Q10 9 8 7"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
};

export const FirstTimeWelcomeMascot: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <svg
      className="shrink-0"
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="36" fill="#10B981" />
      {/* Traffic Officer / Conductor Cap */}
      <path d="M22 28C22 23 28 20 40 20C52 20 58 23 58 28V32H22V28Z" fill="#002113" />
      <ellipse cx="40" cy="32" rx="24" ry="4" fill="#6FFBBE" />
      <circle cx="40" cy="22" r="3" fill="#FEA619" />
      {/* Big Friendly Eyes */}
      <ellipse cx="31" cy="43" rx="3.5" ry="4.5" fill="#002113" />
      <ellipse cx="49" cy="43" rx="3.5" ry="4.5" fill="#002113" />
      <circle cx="29.5" cy="41.5" r="1.5" fill="#ffffff" />
      <circle cx="47.5" cy="41.5" r="1.5" fill="#ffffff" />
      {/* Rosy green cheeks */}
      <ellipse cx="23" cy="50" rx="4.5" ry="2.5" fill="#6FFBBE" opacity="0.9" />
      <ellipse cx="57" cy="50" rx="4.5" ry="2.5" fill="#6FFBBE" opacity="0.9" />
      {/* Joyful open smile */}
      <path
        d="M31 54C34 60 46 60 49 54"
        stroke="#002113"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const GrinningCoolMascot: React.FC<{ size?: number }> = ({ size = 44 }) => {
  return (
    <svg
      className="shrink-0"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="22" cy="22" r="20" fill="#10B981" />
      {/* Sunglasses */}
      <path
        d="M10 18H20C20 23 15 25 11 23C10 22 10 20 10 18Z"
        fill="#002113"
      />
      <path
        d="M24 18H34C34 20 34 22 33 23C29 25 24 23 24 18Z"
        fill="#002113"
      />
      <line x1="19" y1="19" x2="25" y2="19" stroke="#002113" strokeWidth="2.5" />
      {/* Sunglasses shine */}
      <line x1="12" y1="19" x2="16" y2="23" stroke="#6FFBBE" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="26" y1="19" x2="30" y2="23" stroke="#6FFBBE" strokeWidth="1.2" strokeLinecap="round" />
      {/* Cheerful wide smile */}
      <path
        d="M15 28C17 33 27 33 29 28"
        stroke="#002113"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const NervousAmberMascot: React.FC<{ size?: number }> = ({ size = 44 }) => {
  return (
    <svg
      className="shrink-0"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="22" cy="22" r="20" fill="#FEA619" />
      {/* Worried raised eyebrows */}
      <path d="M12 16L18 14" stroke="#684000" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 16L26 14" stroke="#684000" strokeWidth="2" strokeLinecap="round" />
      {/* Big sideways glancing eyes */}
      <circle cx="16" cy="21" r="3.5" fill="#ffffff" />
      <circle cx="28" cy="21" r="3.5" fill="#ffffff" />
      <circle cx="18" cy="21" r="1.8" fill="#684000" />
      <circle cx="30" cy="21" r="1.8" fill="#684000" />
      {/* Wobbly wavy mouth */}
      <path
        d="M15 30Q19 28 22 30Q25 32 29 29"
        stroke="#684000"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Nervous sweat bead */}
      <circle cx="33" cy="14" r="2" fill="#A3DEFE" />
    </svg>
  );
};
