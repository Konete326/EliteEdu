import { BookOpen, FileText, Video, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

const LmsSuitePage = () => {
  const { user } = useAuth();
  const backUrl = user?.role === 'Teacher' ? '/teacher' : '/admin';

  return (
    <GlobalComingSoon
      title="LMS & Digital Learning Studio"
      subtitle="Curriculum Planning, Homework, Lectures & Virtual Classrooms"
      description="The Learning Management System (LMS) is currently under active engineering for Milestone 2. Term syllabus tracking, digital homework assignments, lecture repositories, online quizzes, and virtual live classrooms will be available shortly."
      icon={BookOpen}
      badge="Coming Soon"
      backUrl={backUrl}
      features={[
        {
          title: 'Courses & Syllabus',
          desc: 'Term-wise course outlines, lesson progression, and academic unit tracking.',
          icon: BookOpen
        },
        {
          title: 'Homework & Assignments',
          desc: 'Digital homework dispatch, online submissions, and teacher feedback.',
          icon: FileText
        },
        {
          title: 'Lectures & Resources',
          desc: 'Centralized repository for recorded video lectures, notes, and study PDFs.',
          icon: Video
        },
        {
          title: 'Live Virtual Classrooms',
          desc: 'Interactive live video lectures with digital whiteboard and screen share.',
          icon: Radio
        }
      ]}
    />
  );
};

export default LmsSuitePage;
