const buildHomeworkSummary = (campusList, homeworkList = []) => {
  const total = homeworkList.length;
  const published = homeworkList.filter((h) => h.is_published).length;
  return {
    total,
    published,
    pending: total - published,
    campusBreakdown: campusList.map((c) => {
      const cTotal = homeworkList.filter((h) => String(h.campus_id) === String(c.id)).length;
      const cPublished = homeworkList.filter((h) => String(h.campus_id) === String(c.id) && h.is_published).length;
      return {
        name: c.name,
        sub: c.sub,
        total: cTotal,
        published: cPublished,
        pending: cTotal - cPublished
      };
    })
  };
};

module.exports = { buildHomeworkSummary };
