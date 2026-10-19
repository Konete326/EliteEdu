const QuizQuestionsSelector = ({ questions = [], selected = [], onToggle }) => {
  if (questions.length === 0) return null;
  return (
    <div className="p-2 border rounded-lg max-h-32 overflow-y-auto space-y-1 text-xs">
      <span className="font-semibold text-gray-600 dark:text-gray-400">
        Select Questions ({selected.length} chosen):
      </span>
      {questions.slice(0, 8).map((q) => (
        <label key={q._id} className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.some((sq) => sq._id === q._id)}
            onChange={(e) => onToggle(q, e.target.checked)}
          />
          <span className="truncate">{q.question_text}</span>
        </label>
      ))}
    </div>
  );
};

export default QuizQuestionsSelector;
