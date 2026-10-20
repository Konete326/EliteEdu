import React from 'react';

const DoodleBackground = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-repeat"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2364748b' fill-opacity='0.16' fill-rule='evenodd'%3E%3Cpath d='M20 20h10v2H20zm0 4h6v2h-6zm40 10c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm2 2h-4c-2.2 0-4 1.8-4 4v2h12v-2c0-2.2-1.8-4-4-4zm30-14l4 4-1.4 1.4-4-4zm-8 4l1.4-1.4 4 4-1.4 1.4zm-48 60c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 2c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm40-10h12v2H74zm0 4h8v2h-8zm0 4h12v2H74zm30 10l-4-4 1.4-1.4 4 4zm-4 4l-1.4-1.4 4-4 1.4 1.4zM16 88l3-3 3 3-1.4 1.4-1.6-1.6-1.6 1.6zm80-60l2-2 2 2-1.4 1.4-.6-.6-.6.6z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundColor: '#f8fafc'
    }}
  />
);

export default DoodleBackground;
