const { timeToMinutes, minutesToTime } = require('./bellScheduleHelper');

const generateFridayBellSlots = ({
  school_start_time = '08:00 AM',
  friday_end_time = '12:30 PM',
  assembly_duration = 15,
  friday_total_periods = 5,
  break_duration = 20
}) => {
  const slots = [];
  let curr = timeToMinutes(school_start_time);
  const endLimit = timeToMinutes(friday_end_time);
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

  const periods = Math.max(1, Math.min(8, Number(friday_total_periods) || 5));
  const bMins = Number(break_duration) > 0 ? Number(break_duration) : 20;
  const availablePeriodTime = Math.max(periods * 20, endLimit - curr - bMins);
  const pMins = Math.floor(availablePeriodTime / periods);
  const breakAfter = Math.max(1, Math.floor(periods / 2));

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

    if (p === breakAfter && bMins > 0) {
      const bEnd = curr + bMins;
      slots.push({
        slot_no: slotNo++,
        label: 'Friday Recess',
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

module.exports = { generateFridayBellSlots };

