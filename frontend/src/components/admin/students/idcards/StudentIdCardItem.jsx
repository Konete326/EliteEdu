import DefaultCard from './DefaultCard';
import Style1Card from './Style1Card';
import Style2Card from './Style2Card';
import Style3Card from './Style3Card';
import Style4Card from './Style4Card';

const StudentIdCardItem = ({ student, selectedStyle, isSelected, onToggleSelect, config }) => {
  const renderCard = () => {
    switch (selectedStyle) {
      case 'Style 1':
        return <Style1Card student={student} config={config} />;
      case 'Style 2':
        return <Style2Card student={student} config={config} />;
      case 'Style 3':
        return <Style3Card student={student} config={config} />;
      case 'Style 4':
        return <Style4Card student={student} config={config} />;
      case 'Default':
      default:
        return <DefaultCard student={student} config={config} />;
    }
  };

  return (
    <div className="relative group w-full">
      <div className="absolute top-2 right-2 z-10 print:hidden">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(student._id)}
          className="w-4 h-4 rounded text-primary accent-primary cursor-pointer shadow-sm"
        />
      </div>
      <div className={`transition-all rounded-2xl ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
        {renderCard()}
      </div>
    </div>
  );
};

export default StudentIdCardItem;
