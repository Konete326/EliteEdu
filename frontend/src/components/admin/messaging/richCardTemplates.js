export const CARD_TEMPLATES = [
  {
    id: 'Leave_Approval',
    label: 'Leave Approval',
    color: '#0284c7',
    head: { title: 'Staff Leave Approval Request', sub_title: 'Requires Management Authorization', status_badge: 'Pending', accent_color: '#0284c7' },
    defaultFields: [{ key: 'Applicant', value: 'Faculty Member' }, { key: 'Duration', value: '2 Days (Casual)' }, { key: 'Reason', value: 'Family Medical Urgent' }],
    actions: [{ label: 'Approve', action_value: 'approve', style: 'Primary' }, { label: 'Reject', action_value: 'reject', style: 'Danger' }]
  },
  {
    id: 'Voucher_Approval',
    label: 'Expense Voucher',
    color: '#059669',
    head: { title: 'Payment Voucher Authorization', sub_title: 'Accounts & Expense Verification', status_badge: 'Unapproved', accent_color: '#059669' },
    defaultFields: [{ key: 'Voucher', value: 'PV-Lab Equipment' }, { key: 'Amount', value: 'PKR 18,500' }, { key: 'Payment Mode', value: 'Cheque / Transfer' }],
    actions: [{ label: 'Authorize Voucher', action_value: 'approve', style: 'Primary' }, { label: 'Decline', action_value: 'reject', style: 'Danger' }]
  },
  {
    id: 'Fee_Reminder',
    label: 'Fee Notice',
    color: '#d97706',
    head: { title: 'Tuition Fee Due Notice', sub_title: 'Outstanding Dues Reminder', status_badge: 'Urgent', accent_color: '#d97706' },
    defaultFields: [{ key: 'Student', value: 'Class 9-A Student' }, { key: 'Outstanding', value: 'PKR 7,500' }, { key: 'Due Date', value: '25th Current Month' }],
    actions: [{ label: 'Acknowledge Receipt', action_value: 'acknowledge', style: 'Default' }]
  },
  {
    id: 'Circular_Notice',
    label: 'Notice Memo',
    color: '#4f46e5',
    head: { title: 'Institutional Staff Circular', sub_title: 'Administrative Memorandum', status_badge: 'Notice', accent_color: '#4f46e5' },
    defaultFields: [{ key: 'Subject', value: 'Upcoming Parent-Teacher Meeting' }, { key: 'Date & Time', value: 'Saturday 10:00 AM' }],
    actions: [{ label: 'Acknowledge & Confirm', action_value: 'acknowledge', style: 'Primary' }]
  }
];
