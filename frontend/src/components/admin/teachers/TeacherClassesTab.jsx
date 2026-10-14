import ClassAssignmentForm from './ClassAssignmentForm';
import ClassAssignmentsTable from './ClassAssignmentsTable';

const TeacherClassesTab = ({ subjects = [], grades = [], assignments = [], onAssignmentsChange }) => {
  const handleAdd = (sub, gr, sectionsToAdd) => {
    const newItems = [];
    sectionsToAdd.forEach((sec) => {
      const exists = assignments.some(
        (a) => (a.subject_id?._id || a.subject_id) === sub._id &&
               (a.grade_id?._id || a.grade_id) === gr._id &&
               a.section === sec
      );
      if (!exists) {
        newItems.push({
          subject_id: sub._id,
          grade_id: gr._id,
          section: sec,
          _subject_name: sub.name,
          _grade_name: gr.name
        });
      }
    });

    if (newItems.length > 0) {
      onAssignmentsChange([...assignments, ...newItems]);
    }
  };

  const handleRemove = (index) => {
    onAssignmentsChange(assignments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <ClassAssignmentForm subjects={subjects} grades={grades} onAdd={handleAdd} />
      <ClassAssignmentsTable assignments={assignments} onRemove={handleRemove} />
    </div>
  );
};

export default TeacherClassesTab;
