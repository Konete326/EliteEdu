const mongoose = require('mongoose');
const { getInstitutionHeader } = require('../utils/reportHelpers');
const { buildToppersList, buildResultSummary } = require('../utils/reportExamBuildersA');
const { buildFailCompartment, buildGradeDistribution, buildExamGeneric } = require('../utils/reportExamBuildersB');
const { buildDailyClassSummary, buildAbsentLateStudents, buildApprovedLeaves } = require('../utils/reportAttendanceBuilders');
const { buildStaffDirectory, buildDeptBpsSummary, buildStaffApplicantsReport } = require('../utils/reportStaffBuilders');
const { buildFeeReports } = require('../utils/reportFeeBuilders');
const { buildDuesReports } = require('../utils/reportDuesBuilders');
const { buildAccountsReports } = require('../utils/reportAccountsBuilders');
const { buildCertReports } = require('../utils/reportCertBuilders');
const { buildStaffAttendanceReports } = require('../utils/reportStaffAttendanceBuilders');

const dispatchCategoryReport = async (schoolId, campusId, category, sub, query) => {
  if (category === 'exams') {
    if (sub === 'toppers_list') return buildToppersList(schoolId, campusId, query);
    if (sub === 'result_summary') return buildResultSummary(schoolId, campusId, query);
    if (sub === 'fail_compartment_list') return buildFailCompartment(schoolId, campusId, query);
    if (sub === 'grade_distribution') return buildGradeDistribution(schoolId, campusId, query);
    return buildExamGeneric(schoolId, campusId, query);
  }
  if (category === 'attendance') {
    if (sub === 'daily_class_summary') return buildDailyClassSummary(schoolId, campusId, query);
    if (sub === 'absent_students') return buildAbsentLateStudents(schoolId, campusId, { ...query, status_target: 'A' });
    if (sub === 'late_comers') return buildAbsentLateStudents(schoolId, campusId, { ...query, status_target: 'LT' });
    if (sub === 'approved_leaves') return buildApprovedLeaves(schoolId, campusId);
    return buildDailyClassSummary(schoolId, campusId, query);
  }
  if (category === 'staff_attendance') {
    return buildStaffAttendanceReports(schoolId, campusId, { ...query, sub_report: sub });
  }
  if (category === 'staff_hr') {
    if (sub === 'dept_bps_summary') return buildDeptBpsSummary(schoolId, campusId);
    if (sub === 'staff_applicants_pipeline') return buildStaffApplicantsReport(schoolId, campusId);
    return buildStaffDirectory(schoolId, campusId, query);
  }
  if (category === 'fee_collection' || (category === 'fee_finance' && !['outstanding_dues_report', 'class_wise_defaulters'].includes(sub))) {
    return buildFeeReports(schoolId, campusId, { ...query, sub_report: sub });
  }
  if (category === 'outstanding_dues' || (category === 'fee_finance' && ['outstanding_dues_report', 'class_wise_defaulters'].includes(sub))) {
    return buildDuesReports(schoolId, campusId, { ...query, sub_report: sub });
  }
  if (category === 'accounts_financial') {
    return buildAccountsReports(schoolId, campusId, { ...query, sub_report: sub });
  }
  if (category === 'certificates_docs') {
    return buildCertReports(schoolId, campusId, { ...query, sub_report: sub });
  }
  return { columns: [], rows: [] };
};

const getCategoryData = async (req, res) => {
  try {
    const { category = 'exams', sub_report = 'toppers_list', campus_id } = req.query;
    const schoolId = req.user.school_id;
    const safeCampusId = (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) ? campus_id : null;

    const result = await dispatchCategoryReport(schoolId, safeCampusId, category, sub_report, req.query);
    const header = await getInstitutionHeader(schoolId, safeCampusId);

    return res.status(200).json({
      success: true,
      category,
      sub_report,
      columns: result.columns,
      data: result.rows,
      total: result.rows.length,
      counters: {
        totalRecords: result.rows.length,
        categoryLabel: category.toUpperCase()
      },
      header
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategoryData };
