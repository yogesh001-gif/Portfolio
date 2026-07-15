export function ordinal(value) {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return `${value}th`;
  }

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

export function getAcademicProgress({
  program,
  collegeShort,
  admissionYear,
  graduationYear,
  firstSemesterStartMonth = 7,
  totalSemesters = 8,
  currentDate = new Date(),
}) {
  const now = currentDate;
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const semesterStartYear = month >= firstSemesterStartMonth ? year : year - 1;
  const rawSemester =
    (semesterStartYear - admissionYear) * 2 +
    (month >= firstSemesterStartMonth ? 1 : 2);

  const isGraduated = rawSemester > totalSemesters;
  const semesterNumber = Math.max(1, Math.min(totalSemesters, rawSemester));
  const maxYears = Math.max(1, Math.ceil(totalSemesters / 2));
  const yearNumber = Math.max(1, Math.min(maxYears, Math.ceil(semesterNumber / 2)));

  const yearLabel = `${ordinal(yearNumber)} Year`;
  const semesterLabel = `${ordinal(semesterNumber)} Semester`;
  const batchLabel = `${graduationYear} Batch`;

  if (isGraduated) {
    return {
      yearNumber,
      semesterNumber,
      yearLabel,
      semesterLabel,
      batchLabel,
      heroLine: `${program} Graduate @ ${collegeShort} (${batchLabel})`,
      educationLine: `Graduated in ${graduationYear} (${totalSemesters} semesters completed)`,
    };
  }

  return {
    yearNumber,
    semesterNumber,
    yearLabel,
    semesterLabel,
    batchLabel,
    heroLine: `${yearLabel} ${program} Student @ ${collegeShort} (${batchLabel})`,
    educationLine: `Currently in ${yearLabel}, ${semesterLabel}`,
  };
}
