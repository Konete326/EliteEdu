import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrent: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    days.push({ day: i, isCurrent: true, isToday });
  }
  const remaining = 35 - days.length;
  for (let i = 1; i <= (remaining > 0 ? remaining : 0); i++) {
    days.push({ day: i, isCurrent: false });
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-ink">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <Link to="/admin/events" className="text-xs font-bold text-ink dark:text-ink-dark hover:text-primary transition-colors cursor-pointer">
          {monthNames[month]} {year}
        </Link>
        <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-ink">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-muted mb-1">
        {dayNames.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((d, idx) => (
          <div
            key={idx}
            className={`py-1.5 rounded-lg font-medium transition-colors ${
              d.isToday
                ? 'bg-primary text-white font-bold shadow-sm cursor-pointer'
                : d.isCurrent
                ? 'text-ink dark:text-ink-dark hover:bg-surface-secondary'
                : 'text-ink-muted/50'
            }`}
          >
            {d.isToday ? (
              <Link to="/admin/events" className="block w-full h-full text-white">
                {d.day}
              </Link>
            ) : (
              d.day
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
