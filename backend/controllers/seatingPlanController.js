const Student = require('../models/Student');
const Exam = require('../models/Exam');

const generateSeatingArrangement = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { exam_id, rooms } = req.body;
    let students = [];
    if (exam_id) {
      const exam = await Exam.findOne({ _id: exam_id, school_id });
      const query = { school_id, is_active: true };
      if (exam?.grade_id) query.grade_id = exam.grade_id;
      students = await Student.find(query).populate('grade_id', 'name').sort({ roll_number: 1, name: 1 });
    } else {
      students = await Student.find({ school_id, is_active: true }).populate('grade_id', 'name').limit(120).sort({ roll_number: 1 });
    }

    const roomList = Array.isArray(rooms) && rooms.length > 0 ? rooms : [
      { name: 'Examination Hall 1', capacity: 40, rows: 4, cols: 10 },
      { name: 'Room 101', capacity: 30, rows: 3, cols: 10 },
      { name: 'Room 102', capacity: 30, rows: 3, cols: 10 }
    ];

    let studentIndex = 0;
    const allocations = roomList.map(room => {
      const roomCapacity = Number(room.capacity) || 30;
      const roomSeats = [];
      for (let s = 1; s <= roomCapacity; s++) {
        if (studentIndex < students.length) {
          const st = students[studentIndex++];
          roomSeats.push({
            seat_no: `S-${s < 10 ? '0' + s : s}`,
            student_id: st._id,
            roll_number: st.roll_number || `RN-${st._id.toString().slice(-4)}`,
            name: `${st.first_name || ''} ${st.last_name || ''}`.trim() || st.name || 'Student',
            class_name: st.grade_id?.name || 'Class',
            section: st.section || 'A'
          });
        }
      }
      return { room_name: room.name, total_allocated: roomSeats.length, seats: roomSeats };
    });

    res.json({
      success: true,
      total_students: students.length,
      allocated_students: studentIndex,
      rooms: allocations
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate seating plan', error: error.message });
  }
};

module.exports = { generateSeatingArrangement };
