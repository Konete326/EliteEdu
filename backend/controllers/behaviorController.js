const BehaviorRecord = require('../models/BehaviorRecord');
const Student = require('../models/Student');
const { BADGE_MAP, CONDUCT_MAP, compileClassSheet } = require('../utils/behaviorSheetHelper');

const getClassSheet = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { grade_id, section = 'A', term = 'Mid Term', academic_session = '2026-2027', campus_id } = req.query;
    if (!grade_id) return res.status(400).json({ success: false, message: 'Class is required' });

    const studentQuery = { school_id: schoolId, current_grade: grade_id, is_active: { $ne: false }, status: { $ne: 'Draft' } };
    if (section && section !== 'All') studentQuery.current_section = section;
    if (campus_id) studentQuery.campus_id = campus_id;

    const [students, records] = await Promise.all([
      Student.find(studentQuery).select('name roll_number gr_number current_section current_grade photo_url father_name').sort({ roll_number: 1, name: 1 }).lean(),
      BehaviorRecord.find({ school_id: schoolId, grade_id, section, term_name: term, academic_session }).lean()
    ]);

    const { sheet, kpis } = compileClassSheet(students, records, { grade_id, section, term, academic_session });
    res.status(200).json({ success: true, term, academic_session, students: sheet, kpis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkSaveClassSheet = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { grade_id, section = 'A', term_name = 'Mid Term', academic_session = '2026-2027', evaluations = [], campus_id } = req.body;
    if (!grade_id) return res.status(400).json({ success: false, message: 'Class is required' });

    const operations = evaluations.map((ev) => {
      const conduct = ev.general_conduct || 'Good';
      const badge = BADGE_MAP[conduct] || 'Good_Conduct';
      const filter = { school_id: schoolId, student_id: ev.student_id, term_name, academic_session };
      const update = {
        campus_id: campus_id || null, grade_id, section, term_name, academic_session,
        general_conduct: conduct, badge_type: badge,
        affective_ratings: ev.affective_ratings || {}, psychomotor_ratings: ev.psychomotor_ratings || {},
        teacher_observation: String(ev.teacher_observation || '').trim(), evaluated_by: req.user?._id || null
      };
      return { updateOne: { filter, update: { $set: update }, upsert: true } };
    });

    if (operations.length > 0) await BehaviorRecord.bulkWrite(operations);
    res.status(200).json({ success: true, message: 'Class behavior sheet saved successfully', savedCount: operations.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveBehaviorRecord = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const {
      student_id, grade_id, section, academic_session = '2026-2027', term_name = 'Mid Term',
      general_conduct, affective_ratings = {}, psychomotor_ratings = {},
      badge_type, teacher_observation = '', campus_id
    } = req.body;

    if (!student_id || !grade_id) return res.status(400).json({ success: false, message: 'Student and Class are required' });

    const student = await Student.findOne({ _id: student_id, school_id: schoolId }).select('current_section campus_id').lean();
    const resolvedSection = section || student?.current_section || 'A';
    const resolvedCampusId = campus_id || student?.campus_id || null;
    const resolvedBadge = badge_type || (general_conduct ? BADGE_MAP[general_conduct] : 'Good_Conduct');
    const resolvedConduct = general_conduct || CONDUCT_MAP[badge_type] || 'Good';

    const filter = { school_id: schoolId, student_id, term_name, academic_session };
    const update = {
      school_id: schoolId, campus_id: resolvedCampusId, student_id, grade_id,
      section: resolvedSection, academic_session, term_name,
      general_conduct: resolvedConduct, badge_type: resolvedBadge,
      affective_ratings, psychomotor_ratings,
      teacher_observation: String(teacher_observation || '').trim(), evaluated_by: req.user?._id || null
    };

    const record = await BehaviorRecord.findOneAndUpdate(filter, { $set: update }, { new: true, upsert: true });
    res.status(200).json({ success: true, message: 'Assessment saved successfully', data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBehaviorRecords = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { grade_id, section, student_id, term_name } = req.query;
    const q = { school_id: schoolId };
    if (grade_id) q.grade_id = grade_id;
    if (section && section !== 'All') q.section = section;
    if (student_id) q.student_id = student_id;
    if (term_name) q.term_name = term_name;

    const records = await BehaviorRecord.find(q).populate('student_id', 'name roll_number photo_url').sort({ updatedAt: -1 }).lean();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBehaviorRecord = async (req, res) => {
  try {
    await BehaviorRecord.findOneAndDelete({ _id: req.params.id, school_id: req.schoolId || req.user?.school_id });
    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getClassSheet, bulkSaveClassSheet, saveBehaviorRecord, getBehaviorRecords, deleteBehaviorRecord };
