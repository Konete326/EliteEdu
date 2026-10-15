import { useState } from 'react';

const AdmissionsAreaBreakdown = ({ areas = [], totalAdmissions = 0 }) => {
  const [areaMode, setAreaMode] = useState('Area');

  return (
    <div className="lg:col-span-4 flex flex-col items-center justify-between border-t lg:border-t-0 lg:border-l border-line dark:border-line-dark pt-3 lg:pt-0 lg:pl-4">
      <div className="w-full flex items-center justify-between text-xs">
        <span className="font-semibold text-ink dark:text-ink-dark">Admissions by Area</span>
        <div className="flex bg-surface-secondary dark:bg-surface-secondary-dark rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setAreaMode('Area')}
            className={`px-2 py-0.5 text-[10px] rounded ${areaMode === 'Area' ? 'bg-primary text-white' : 'text-ink-muted'}`}
          >
            Area Wise
          </button>
        </div>
      </div>

      <div className="my-3 relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center flex-col text-center">
          <span className="text-lg font-black text-ink dark:text-ink-dark">{totalAdmissions}</span>
          <span className="text-[9px] text-ink-muted uppercase">Students</span>
        </div>
      </div>

      <div className="w-full space-y-1 text-[11px] text-ink-muted">
        {areas.length > 0 ? (
          areas.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 truncate max-w-[140px]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color || '#3b82f6' }} />
                <span className="truncate">{item.name}</span>
              </span>
              <span className="font-semibold text-ink dark:text-ink-dark">{item.count}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-[10px] text-ink-muted py-2">No regional records</p>
        )}
      </div>
    </div>
  );
};

export default AdmissionsAreaBreakdown;
