export function ordinal(n) {
  const m = n % 100;
  if (m >= 11 && m <= 13) return `${n}th`;
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'}`;
}

/* Works out the current year/semester from the admission year,
   so the site never goes stale. */
export function getAcademicProgress({
  admissionYear,
  graduationYear,
  firstSemesterStartMonth = 7,
  totalSemesters = 8,
  now = new Date(),
}) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const inOddSemester = month >= firstSemesterStartMonth;
  const semStartYear = inOddSemester ? year : year - 1;
  const raw = (semStartYear - admissionYear) * 2 + (inOddSemester ? 1 : 2);
  const graduated = raw > totalSemesters;
  const semester = Math.max(1, Math.min(totalSemesters, raw));
  const studyYear = Math.ceil(semester / 2);

  return {
    graduated,
    semester,
    studyYear,
    label: graduated
      ? `Graduated ${graduationYear}`
      : `${ordinal(studyYear)} year · ${ordinal(semester)} semester`,
  };
}
