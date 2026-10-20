const FeeInvoice = require('../models/FeeInvoice');
const Grade = require('../models/Grade');
const LeaveRequest = require('../models/LeaveRequest');

const buildDefaultersCard = async (schoolId, user, classQuery) => {
  if (!['Admin', 'SuperAdmin'].includes(user?.role)) {
    throw new Error('Unauthorized: Only Administrators can run /defaulters');
  }

  const trimmed = (classQuery || '').trim();
  let gradeId = null;
  let gradeName = 'All Campus';

  if (trimmed) {
    const grade = await Grade.findOne({ school_id: schoolId, name: { $regex: trimmed, $options: 'i' } });
    if (grade) {
      gradeId = grade._id;
      gradeName = grade.name;
    }
  }

  const filter = { school_id: schoolId, status: { $in: ['Unpaid', 'Partial', 'Overdue'] } };
  if (gradeId) filter.grade_id = gradeId;

  const invoices = await FeeInvoice.find(filter).populate('student_id', 'name gr_number').sort({ balance_due: -1 }).limit(100);
  const totalArrears = invoices.reduce((acc, inv) => acc + (inv.balance_due || 0), 0);
  const topNames = invoices.slice(0, 3).map((i) => `${i.student_id?.name || 'Student'} (PKR ${i.balance_due || 0})`).join(', ');

  return {
    card_type: 'Fee_Reminder',
    head: {
      title: `Fee Defaulters: ${gradeName}`,
      sub_title: 'Outstanding Fee Overview',
      status_badge: `${invoices.length} Defaulters`,
      accent_color: '#d97706'
    },
    fields: [
      { key: 'Scope', value: gradeName },
      { key: 'Total Defaulters', value: String(invoices.length) },
      { key: 'Total Arrears', value: `PKR ${totalArrears.toLocaleString()}` },
      { key: 'Top Defaulters', value: topNames || 'None' }
    ]
  };
};

const buildLeaveCard = async (schoolId, user, daysArg, reasonArg) => {
  const days = Math.max(1, parseInt(daysArg, 10) || 1);
  const reason = (reasonArg || '').trim() || 'Staff Urgent Leave';
  const todayStr = new Date().toISOString().split('T')[0];
  const toDateStr = new Date(Date.now() + (days - 1) * 86400000).toISOString().split('T')[0];

  const newLeave = await LeaveRequest.create({
    school_id: schoolId, applicant_type: 'Staff', staff_id: user._id || user.id,
    leave_type: 'Casual Leave', from_date: todayStr, to_date: toDateStr,
    total_days: days, reason, status: 'Pending', created_by: user._id || user.id
  });

  return {
    card_type: 'Leave_Approval', ref_model: 'LeaveRequest', ref_id: newLeave._id,
    head: {
      title: 'Staff Leave Application', sub_title: `Submitted by ${user.name || 'Staff'}`,
      status_badge: 'Pending Approval', accent_color: '#4f46e5'
    },
    body: { text: reason },
    fields: [
      { key: 'Applicant', value: user.name || 'Staff' },
      { key: 'Total Days', value: `${days} Day(s)` },
      { key: 'Period', value: `${todayStr} to ${toDateStr}` },
      { key: 'Reason', value: reason }
    ],
    actions: [
      { label: 'Approve', action_value: 'approve', style: 'Primary' },
      { label: 'Reject', action_value: 'reject', style: 'Danger' }
    ]
  };
};

const buildCircularCard = (user, argsText) => {
  let clean = (argsText || '').trim();
  const isBroadcast = clean.startsWith('--all');
  if (isBroadcast) clean = clean.slice(5).trim();

  let [title, ...rest] = clean.split('|');
  let message = rest.join('|').trim();
  title = (title || '').trim();
  if (!message) {
    message = title || 'Official notice from administration';
    title = 'Important Circular';
  }

  return {
    card_type: 'Circular_Notice',
    is_broadcast: isBroadcast,
    head: {
      title,
      sub_title: `${isBroadcast ? 'All-Staff Broadcast' : 'Circular'} by ${user.name || 'Admin'}`,
      status_badge: isBroadcast ? 'Broadcast Notice' : 'Official Notice',
      accent_color: '#7c3aed'
    },
    body: { text: message },
    fields: [
      { key: 'Issued By', value: user.name || 'Administration' },
      { key: 'Scope', value: isBroadcast ? 'All Staff Conversations' : 'Current Chat' },
      { key: 'Date', value: new Date().toISOString().split('T')[0] },
      { key: 'Subject', value: title }
    ],
    actions: [{ label: 'Acknowledge', action_value: 'acknowledge', style: 'Primary' }]
  };
};

module.exports = { buildDefaultersCard, buildLeaveCard, buildCircularCard };
