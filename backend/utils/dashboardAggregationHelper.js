const Student = require('../models/Student');
const FeePayment = require('../models/FeePayment');
const AccountTransaction = require('../models/AccountTransaction');

const getAggregatedFeeStats = async (schoolObjId, startOfYear, startOfMonth, startOfToday) => {
  const result = await FeePayment.aggregate([
    {
      $match: {
        school_id: schoolObjId,
        status: { $ne: 'Void' },
        payment_date: { $gte: startOfYear }
      }
    },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              todayCollection: {
                $sum: { $cond: [{ $gte: ['$payment_date', startOfToday] }, '$paid_amount', 0] }
              },
              mtdCollection: {
                $sum: { $cond: [{ $gte: ['$payment_date', startOfMonth] }, '$paid_amount', 0] }
              },
              ytdCollection: {
                $sum: '$paid_amount'
              }
            }
          }
        ],
        byCampus: [
          {
            $group: {
              _id: '$campus_id',
              today: {
                $sum: { $cond: [{ $gte: ['$payment_date', startOfToday] }, '$paid_amount', 0] }
              },
              mtd: {
                $sum: { $cond: [{ $gte: ['$payment_date', startOfMonth] }, '$paid_amount', 0] }
              },
              ytd: {
                $sum: '$paid_amount'
              }
            }
          }
        ]
      }
    }
  ]);

  const totals = result[0]?.totals?.[0] || { todayCollection: 0, mtdCollection: 0, ytdCollection: 0 };
  const campusMap = new Map();
  (result[0]?.byCampus || []).forEach((c) => {
    campusMap.set(String(c._id || ''), c);
  });

  return { totals, campusMap };
};

const getAggregatedExpenseStats = async (schoolObjId, startOfYear, startOfMonth, startOfToday) => {
  const result = await AccountTransaction.aggregate([
    {
      $match: {
        school_id: schoolObjId,
        voucher_type: 'Expense',
        approval_status: 'Approved',
        transaction_date: { $gte: startOfYear }
      }
    },
    {
      $group: {
        _id: null,
        todayExp: {
          $sum: { $cond: [{ $gte: ['$transaction_date', startOfToday] }, '$amount', 0] }
        },
        mtdExp: {
          $sum: { $cond: [{ $gte: ['$transaction_date', startOfMonth] }, '$amount', 0] }
        },
        ytdExp: {
          $sum: '$amount'
        }
      }
    }
  ]);

  return result[0] || { todayExp: 0, mtdExp: 0, ytdExp: 0 };
};

const getAggregatedStudentStats = async (schoolObjId, curYear, curMonth, curDay) => {
  const result = await Student.aggregate([
    { $match: { school_id: schoolObjId } },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalStudents: { $sum: 1 },
              activeStudents: {
                $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
              },
              maleStudents: {
                $sum: { $cond: [{ $eq: ['$gender', 'Male'] }, 1, 0] }
              },
              femaleStudents: {
                $sum: { $cond: [{ $eq: ['$gender', 'Female'] }, 1, 0] }
              },
              totalMonthlyFee: {
                $sum: {
                  $cond: [
                    { $eq: ['$status', 'Active'] },
                    { $max: [0, { $subtract: [{ $ifNull: ['$monthly_fee', 0] }, { $ifNull: ['$discount', 0] }] }] },
                    0
                  ]
                }
              },
              pendingLeads: {
                $sum: {
                  $cond: [{ $eq: ['$admission_test.status', 'Pending'] }, 1, 0]
                }
              },
              passedTests: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $eq: ['$admission_test.status', 'Passed'] },
                        { $eq: ['$admission_test.test_passed', true] }
                      ]
                    },
                    1,
                    0
                  ]
                }
              },
              totalDropouts: {
                $sum: { $cond: [{ $eq: ['$status', 'Left'] }, 1, 0] }
              }
            }
          }
        ],
        byCampus: [
          {
            $group: {
              _id: '$campus_id',
              totalStudents: { $sum: 1 },
              activeStudents: {
                $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
              },
              estMonthlyFee: {
                $sum: {
                  $cond: [
                    { $eq: ['$status', 'Active'] },
                    { $max: [0, { $subtract: [{ $ifNull: ['$monthly_fee', 0] }, { $ifNull: ['$discount', 0] }] }] },
                    0
                  ]
                }
              }
            }
          }
        ],
        areaBreakdown: [
          {
            $group: {
              _id: { $ifNull: ['$address.area', 'General / Unspecified'] },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        admissionsMonthly: [
          {
            $project: {
              dt: { $ifNull: ['$admission_date', '$createdAt'] }
            }
          },
          {
            $match: {
              dt: { $type: 'date' },
              $expr: { $eq: [{ $year: '$dt' }, curYear] }
            }
          },
          {
            $group: {
              _id: { $month: '$dt' },
              count: { $sum: 1 }
            }
          }
        ],
        dropoutsMonthly: [
          {
            $match: {
              status: 'Left'
            }
          },
          {
            $project: {
              dt: { $ifNull: ['$updatedAt', '$createdAt'] }
            }
          },
          {
            $match: {
              dt: { $type: 'date' },
              $expr: { $eq: [{ $year: '$dt' }, curYear] }
            }
          },
          {
            $group: {
              _id: { $month: '$dt' },
              count: { $sum: 1 }
            }
          }
        ],
        birthdaysToday: [
          {
            $match: {
              dob: { $type: 'date' },
              $expr: {
                $and: [
                  { $eq: [{ $month: '$dob' }, curMonth + 1] },
                  { $eq: [{ $dayOfMonth: '$dob' }, curDay] }
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              name: 1,
              role: { $literal: 'Student' }
            }
          }
        ]
      }
    }
  ]);

  const facet = result[0] || {};
  const summary = facet.summary?.[0] || {
    totalStudents: 0,
    activeStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
    totalMonthlyFee: 0,
    pendingLeads: 0,
    passedTests: 0,
    totalDropouts: 0
  };

  const campusMap = new Map();
  (facet.byCampus || []).forEach((c) => {
    campusMap.set(String(c._id || ''), c);
  });

  const admissionsMonthlyMap = new Map();
  (facet.admissionsMonthly || []).forEach((m) => {
    admissionsMonthlyMap.set(m._id, m.count);
  });

  const dropoutsMonthlyMap = new Map();
  (facet.dropoutsMonthly || []).forEach((m) => {
    dropoutsMonthlyMap.set(m._id, m.count);
  });

  return {
    summary,
    campusMap,
    areaBreakdown: facet.areaBreakdown || [],
    admissionsMonthlyMap,
    dropoutsMonthlyMap,
    birthdaysToday: facet.birthdaysToday || []
  };
};

module.exports = {
  getAggregatedFeeStats,
  getAggregatedExpenseStats,
  getAggregatedStudentStats
};
