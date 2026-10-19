export const timeToMinutes = (timeStr = '08:00 AM') => {
  const match = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 480;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = (match[3] || 'AM').toUpperCase();
  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export const minutesToTime = (totalMinutes) => {
  let m = totalMinutes % (24 * 60);
  if (m < 0) m += 24 * 60;
  let hours = Math.floor(m / 60);
  const minutes = m % 60;
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hStr = hours < 10 ? `0${hours}` : `${hours}`;
  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hStr}:${mStr} ${meridiem}`;
};

export const generateClientBellSlots = ({
  school_start_time = '08:00 AM',
  assembly_duration = 15,
  period_duration = 40,
  total_periods = 7,
  break_after_period = 4,
  break_duration = 30
}) => {
  const slots = [];
  let curr = timeToMinutes(school_start_time);
  let slotNo = 1;

  if (Number(assembly_duration) > 0) {
    const end = curr + Number(assembly_duration);
    slots.push({
      slot_no: slotNo++,
      label: 'Morning Assembly',
      slot_type: 'Assembly',
      period_index: null,
      start_time: minutesToTime(curr),
      end_time: minutesToTime(end)
    });
    curr = end;
  }

  const periods = Math.max(1, Math.min(10, Number(total_periods) || 7));
  const breakAfter = Number(break_after_period) || 4;
  const breakMins = Number(break_duration) || 30;
  const pMins = Number(period_duration) || 40;

  for (let p = 1; p <= periods; p++) {
    const end = curr + pMins;
    slots.push({
      slot_no: slotNo++,
      label: `Period ${p}`,
      slot_type: 'Period',
      period_index: p,
      start_time: minutesToTime(curr),
      end_time: minutesToTime(end)
    });
    curr = end;

    if (p === breakAfter && breakMins > 0) {
      const bEnd = curr + breakMins;
      slots.push({
        slot_no: slotNo++,
        label: 'Break / Recess',
        slot_type: 'Break',
        period_index: null,
        start_time: minutesToTime(curr),
        end_time: minutesToTime(bEnd)
      });
      curr = bEnd;
    }
  }

  return slots;
};
