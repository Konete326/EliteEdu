import api from '../services/api';

export const DATASET_DEFINITIONS = [
  {
    id: 'students',
    name: 'Student Directory',
    description: 'Enrolled students, admission numbers, parent details, contact information and academic status.',
    category: 'Academic',
    defaultFilename: 'EliteEdu_Students_Export',
    columns: (isGovt) => {
      const base = [
        { header: 'GR / Roll #', key: 'roll_no' },
        { header: 'Student Name', key: 'name' },
        { header: 'Father Name', key: 'father_name' },
        { header: 'Campus', key: 'campus' },
        { header: 'Class / Grade', key: 'grade' },
        { header: 'Section', key: 'section' },
        { header: 'Gender', key: 'gender' },
        { header: 'B-Form / CNIC', key: 'cnic' },
        { header: 'Guardian Phone', key: 'phone' },
        { header: 'Emergency Contact', key: 'emergency_contact' },
        { header: 'Admission Date', key: 'admission_date' },
        { header: 'Status', key: 'status' }
      ];
      if (!isGovt) {
        base.push({ header: 'Monthly Tuition (PKR)', key: 'monthly_fee' });
      }
      return base;
    },
    fetcher: async (filters = {}, isGovt = false) => {
      const params = { limit: 5000 };
      if (filters.campus && filters.campus !== 'all') params.campus = filters.campus;
      if (filters.grade && filters.grade !== 'all') params.grade = filters.grade;
      if (filters.status && filters.status !== 'all') params.status = filters.status;

      const res = await api.get('/students', { params });
      const rawList = res.data?.students || res.data || [];
      return rawList.map((s) => ({
        roll_no: s.roll_no || s.admission_no || s.gr_no || '-',
        name: s.name || '',
        father_name: s.father_name || s.guardian_name || '-',
        campus: s.campus_id?.name || s.campus?.name || '-',
        grade: s.current_grade?.name || s.grade?.name || s.class_name || '-',
        section: s.section || 'A',
        gender: s.gender || '-',
        cnic: s.b_form || s.cnic || '-',
        phone: s.phone || s.guardian_phone || s.father_phone || '-',
        emergency_contact: s.emergency_contact || '-',
        admission_date: s.admission_date ? new Date(s.admission_date).toLocaleDateString('en-GB') : '-',
        status: s.status || 'Active',
        monthly_fee: !isGovt ? (s.monthly_fee ?? s.fee_structure?.monthly_tuition ?? '-') : undefined
      }));
    }
  },
  {
    id: 'teachers',
    name: 'Staff & Faculty Directory',
    description: 'Teachers, administrative faculty, designations, BPS grades, phone numbers and appointment dates.',
    category: 'HR & Staff',
    defaultFilename: 'EliteEdu_Faculty_Export',
    columns: () => [
      { header: 'Employee Code', key: 'code' },
      { header: 'Staff Name', key: 'name' },
      { header: 'Father / Husband Name', key: 'father_name' },
      { header: 'Designation', key: 'designation' },
      { header: 'Campus', key: 'campus' },
      { header: 'BPS Grade', key: 'bps_grade' },
      { header: 'CNIC', key: 'cnic' },
      { header: 'Mobile Phone', key: 'phone' },
      { header: 'Qualification', key: 'qualification' },
      { header: 'Appointment Date', key: 'appointment_date' },
      { header: 'Status', key: 'status' }
    ],
    fetcher: async (filters = {}) => {
      const params = { limit: 5000 };
      if (filters.campus && filters.campus !== 'all') params.campus = filters.campus;
      const res = await api.get('/teachers', { params });
      const rawList = res.data?.teachers || res.data || [];
      return rawList.map((t) => ({
        code: t.employee_code || t.code || '-',
        name: t.name || '',
        father_name: t.father_name || t.spouse_name || '-',
        designation: t.designation || 'Faculty',
        campus: t.campus_id?.name || t.campus?.name || '-',
        bps_grade: t.bps_grade || '-',
        cnic: t.cnic || '-',
        phone: t.phone || t.mobile || '-',
        qualification: t.qualification || '-',
        appointment_date: t.joining_date || t.appointment_date ? new Date(t.joining_date || t.appointment_date).toLocaleDateString('en-GB') : '-',
        status: t.status || 'Active'
      }));
    }
  },
  {
    id: 'applicants',
    name: 'Admission Inquiries & Applicants',
    description: 'Prospective student leads, inquiry source, target grades, parent contacts and follow-up stages.',
    category: 'Admissions',
    defaultFilename: 'EliteEdu_Admissions_Inquiries_Export',
    columns: () => [
      { header: 'Lead Code', key: 'code' },
      { header: 'Candidate Name', key: 'name' },
      { header: 'Father / Guardian', key: 'father_name' },
      { header: 'Applied Class', key: 'grade' },
      { header: 'Campus', key: 'campus' },
      { header: 'Primary Contact', key: 'phone' },
      { header: 'Source', key: 'source' },
      { header: 'Current Stage', key: 'stage' },
      { header: 'Date Inquired', key: 'date' }
    ],
    fetcher: async (filters = {}) => {
      const params = { limit: 5000 };
      if (filters.campus && filters.campus !== 'all') params.campus = filters.campus;
      const res = await api.get('/crm/leads', { params }).catch(() => ({ data: [] }));
      const rawList = res.data?.leads || res.data || [];
      return rawList.map((l) => ({
        code: l.lead_no || l.code || '-',
        name: l.student_name || l.name || '',
        father_name: l.father_name || l.guardian_name || '-',
        grade: l.grade_id?.name || l.applied_grade || '-',
        campus: l.campus_id?.name || '-',
        phone: l.phone || l.mobile || '-',
        source: l.source || 'Walk-in',
        stage: l.stage || 'Inquiry',
        date: l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-GB') : '-'
      }));
    }
  },
  {
    id: 'classes',
    name: 'Classes & Sections Roster',
    description: 'Academic grade levels, campus assignments, class capacity, stream and current enrollment counts.',
    category: 'Structure',
    defaultFilename: 'EliteEdu_Classes_Roster_Export',
    columns: () => [
      { header: 'Class Name', key: 'name' },
      { header: 'Campus', key: 'campus' },
      { header: 'Section', key: 'section' },
      { header: 'Max Capacity', key: 'capacity' },
      { header: 'Enrolled Count', key: 'enrolled' },
      { header: 'Status', key: 'status' }
    ],
    fetcher: async (filters = {}) => {
      const res = await api.get('/grades').catch(() => ({ data: [] }));
      const rawList = res.data?.grades || res.data || [];
      return rawList.map((g) => ({
        name: g.name || '',
        campus: g.campus_id?.name || g.campus?.name || '-',
        section: g.section || 'A',
        capacity: g.capacity || 40,
        enrolled: g.students_count || g.total_students || 0,
        status: g.status || 'Active'
      }));
    }
  },
  {
    id: 'subjects',
    name: 'Curriculum & Subjects List',
    description: 'Assigned courses, subject codes, weekly teaching periods and grade allocations.',
    category: 'Structure',
    defaultFilename: 'EliteEdu_Curriculum_Subjects_Export',
    columns: () => [
      { header: 'Subject Code', key: 'code' },
      { header: 'Subject Name', key: 'name' },
      { header: 'Class / Grade', key: 'grade' },
      { header: 'Campus', key: 'campus' },
      { header: 'Weekly Periods', key: 'weekly_periods' },
      { header: 'Subject Type', key: 'type' }
    ],
    fetcher: async (filters = {}) => {
      const res = await api.get('/subjects').catch(() => ({ data: [] }));
      const rawList = res.data?.subjects || res.data || [];
      return rawList.map((sub) => ({
        code: sub.code || '-',
        name: sub.name || '',
        grade: sub.grade_id?.name || sub.grade?.name || '-',
        campus: sub.campus_id?.name || '-',
        weekly_periods: sub.periods_per_week || sub.weekly_periods || 5,
        type: sub.is_elective ? 'Elective' : 'Compulsory'
      }));
    }
  },
  {
    id: 'campuses',
    name: 'School Branches & Campuses',
    description: 'Branch profiles, campus codes, designated heads, contact landlines and physical locations.',
    category: 'Structure',
    defaultFilename: 'EliteEdu_Campuses_Export',
    columns: () => [
      { header: 'Campus Code', key: 'code' },
      { header: 'Campus Name', key: 'name' },
      { header: 'Principal / Head', key: 'head_name' },
      { header: 'Official Phone', key: 'phone' },
      { header: 'Physical Address', key: 'address' },
      { header: 'Status', key: 'status' }
    ],
    fetcher: async () => {
      const res = await api.get('/campuses').catch(() => ({ data: [] }));
      const rawList = res.data?.campuses || res.data || [];
      return rawList.map((c) => ({
        code: c.code || '-',
        name: c.name || '',
        head_name: c.principal_name || c.head_name || '-',
        phone: c.phone || c.contact_no || '-',
        address: c.address || '-',
        status: c.is_active ? 'Active' : 'Inactive'
      }));
    }
  },
  {
    id: 'attendance',
    name: "Today's Attendance Snapshot",
    description: 'Live attendance records marked today across all classes and faculty members.',
    category: 'Operations',
    defaultFilename: 'EliteEdu_Attendance_Today_Export',
    columns: () => [
      { header: 'Date', key: 'date' },
      { header: 'Member Name', key: 'name' },
      { header: 'Member Type', key: 'type' },
      { header: 'Roll / Code', key: 'code' },
      { header: 'Class / Department', key: 'group' },
      { header: 'Attendance Status', key: 'status' },
      { header: 'Marked At', key: 'time' }
    ],
    fetcher: async (filters = {}) => {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.get('/attendance', { params: { date: today } }).catch(() => ({ data: [] }));
      const rawList = res.data?.records || res.data?.attendance || res.data || [];
      return rawList.map((a) => ({
        date: today,
        name: a.student_id?.name || a.teacher_id?.name || a.name || 'Member',
        type: a.student_id ? 'Student' : a.teacher_id ? 'Staff' : 'Student',
        code: a.student_id?.roll_no || a.teacher_id?.employee_code || '-',
        group: a.grade_id?.name || a.teacher_id?.designation || '-',
        status: a.status || 'Present',
        time: a.check_in || (a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-')
      }));
    }
  }
];

