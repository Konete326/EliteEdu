import { Radio, Video, Presentation, Users, ShieldCheck } from 'lucide-react';

const ClassroomComingSoon = ({ role = 'User' }) => {
  const features = [
    {
      icon: Video,
      title: 'HD Video & Audio Studio',
      desc: 'Seamless live virtual sessions with crystal-clear audio and zero latency.'
    },
    {
      icon: Presentation,
      title: 'Interactive Whiteboard',
      desc: 'Real-time collaborative drawing and presentation canvas for lectures.'
    },
    {
      icon: Users,
      title: 'Auto Attendance Sync',
      desc: 'Instant attendance capture when students join the live room.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Institution Meet',
      desc: 'Encrypted virtual rooms restricted only to verified campus members.'
    }
  ];

  return (
    <div className="relative rounded-3xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-6 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-xs overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
        <Radio className="w-10 h-10 animate-pulse text-primary" />
      </div>

      <div className="space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          <span>Milestone Feature • Under Development</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-ink dark:text-ink-dark tracking-tight pt-1">
          Live Virtual Classroom Studio
        </h2>

        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          {role === 'Teacher'
            ? 'The Teacher Live Classroom module is currently being finalized. You will soon be able to broadcast live lessons, share whiteboards, and engage with your assigned classes directly here.'
            : role === 'Student'
            ? 'Virtual live classrooms are coming soon. You will be able to join your class teacher’s live lessons, raise questions, and participate interactively.'
            : 'Institutional virtual classrooms and Zoom/Meet integrations are being engineered for an upcoming release. Direct live broadcasts, lecture screen-sharing, and real-time attendance will be available soon.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-3xl pt-2">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-2xl border border-line/60 dark:border-line-dark/60 bg-surface-secondary/50 dark:bg-white/5 text-left space-y-1.5 transition-all hover:border-primary/40"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon size={16} />
              </div>
              <h4 className="font-bold text-xs text-ink dark:text-ink-dark pt-1">{feat.title}</h4>
              <p className="text-[11px] text-ink-muted leading-snug">{feat.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-ink-muted text-xs flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-good inline-block" />
        <span className="font-medium">Core homework, lectures, quizzes & syllabus trackers remain fully operational.</span>
      </div>
    </div>
  );
};

export default ClassroomComingSoon;
