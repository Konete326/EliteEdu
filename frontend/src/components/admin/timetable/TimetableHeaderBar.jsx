import { Clock, Calendar, Users, Printer, UserCheck } from 'lucide-react';
import MobileTabStepper from '../../common/MobileTabStepper';

const MODES = [
  { id: 'timings', label: '1. School & Break Timings', icon: Clock },
  { id: 'class', label: '2. Class-Wise Timetable', icon: Calendar },
  { id: 'teacher', label: '3. Teacher-Wise Schedule', icon: Users },
  { id: 'substitutions', label: '4. Relief / Substitute Teachers', icon: UserCheck }
];

const TimetableHeaderBar = ({ activeMode = 'class', onChangeMode, onPrint }) => (
  <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-base sm:text-xl font-black text-ink dark:text-ink-dark tracking-tight">
            Smart Timetable &amp; Schedule Master
          </h1>
          <p className="hidden sm:block text-xs font-semibold text-ink-muted">
            Bell schedule, class periods, teacher allocations and live relief cover
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onPrint}
        className="md:hidden px-3 py-1.5 bg-surface-secondary text-primary rounded-xl text-xs font-bold flex items-center gap-1.5 border border-line cursor-pointer shrink-0"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print</span>
      </button>
    </div>

    <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center gap-2">
      <div className="w-full md:w-auto">
        <MobileTabStepper
          tabs={MODES}
          activeTab={activeMode}
          onChange={onChangeMode}
        />
      </div>
      <button
        type="button"
        onClick={onPrint}
        className="hidden md:inline-flex px-3.5 py-2 bg-surface-secondary/80 text-primary hover:bg-primary/10 rounded-xl text-xs font-bold items-center gap-1.5 transition-colors border border-line shadow-xs cursor-pointer shrink-0"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print Routine</span>
      </button>
    </div>
  </div>
);

export default TimetableHeaderBar;
