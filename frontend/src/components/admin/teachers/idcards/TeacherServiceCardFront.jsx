import TeacherCardGovtSindh from './TeacherCardGovtSindh';
import TeacherCardModernExecutive from './TeacherCardModernExecutive';
import TeacherCardMinimalCorporate from './TeacherCardMinimalCorporate';
import TeacherCardLandscapeBadge from './TeacherCardLandscapeBadge';

const TeacherServiceCardFront = ({ teacher, config = {}, style = 'GovtSindh' }) => {
  switch (style) {
    case 'style1':
    case 'Style 1':
    case 'ModernExecutive':
    case 'Institutional':
      return <TeacherCardModernExecutive teacher={teacher} config={config} />;
    case 'style2':
    case 'Style 2':
    case 'MinimalCorporate':
    case 'ModernMinimal':
      return <TeacherCardMinimalCorporate teacher={teacher} config={config} />;
    case 'style3':
    case 'Style 3':
    case 'LandscapeBadge':
      return <TeacherCardLandscapeBadge teacher={teacher} config={config} />;
    case 'GovtSindh':
    case 'Official':
    default:
      return <TeacherCardGovtSindh teacher={teacher} config={config} />;
  }
};

export default TeacherServiceCardFront;
