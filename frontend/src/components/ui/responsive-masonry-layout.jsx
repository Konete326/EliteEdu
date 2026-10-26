import React from 'react';

const Masonry = ({ children, className = '', cols = '' }) => {
  const childArray = React.Children.toArray(children);
  const columnClasses = cols || 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5';

  return (
    <div className={`${columnClasses} gap-6 ${className}`}>
      {childArray.map((child, index) => (
        <div key={child.key || index} className="break-inside-avoid mb-6 inline-block w-full">
          {child}
        </div>
      ))}
    </div>
  );
};

export { Masonry };
export default Masonry;
