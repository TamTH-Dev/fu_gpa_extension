const excludedSubjects = [
  'GDQP',
  'VOV114',
  'VOV124',
  'VOV134',
  'PRO001',
  'LAB101',
  'LAB211',
  'LAB221',
  'LAB231',
  'OJS201',
  'SYB301',
]
const values = calculateValues(excludedSubjects)
const report = createReport(values)
renderGPA(report)

function calculateValues(excludedSubjects) {
  const rows = document.querySelectorAll(
    '#ctl00_mainContent_divGrade > table.table.table-hover > tbody > tr'
  )

  let factorTotal = 0
  let gradeTotal = 0
  let semesterGrades = []
  let semesterFactor = 0
  let semesterGrade = 0
  let curSemester = 0

  const rowsLen = rows.length

  for (let i = 0; i < rowsLen; i++) {
    const cols = rows[i].childNodes
    let factor = null
    let grade = null

    for (let j = 0; j < cols.length; j++) {
      const value = cols[j].innerText.trim()

      if (j === 3 && excludedSubjects.includes(value)) {
        break
      }

      if ((j === 7 && value && value !== '0') || (j === 8 && value)) {
        if (j === 7) {
          factor = Number(value)
        } else if (j === 8) {
          grade = Number(value)
        }

        if (factor && grade) {
          semesterFactor += factor
          semesterGrade += factor * grade
          factor = null
          grade == null
        }
      }

      if (
        (j === 1 && Number(value) !== curSemester) ||
        (Number(value) === 9 && i === rowsLen - 1)
      ) {
        if (semesterGrade !== 0) {
          semesterGrades.push({
            semester: curSemester,
            semesterGrade: (semesterGrade / semesterFactor).toFixed(2),
          })
          factorTotal += semesterFactor
          gradeTotal += semesterGrade
        }
        semesterFactor = 0
        semesterGrade = 0
        curSemester = Number(value)
      }
    }
  }

  return {
    gpa: (gradeTotal / factorTotal).toFixed(2),
    semesterGrades,
  }
}

function renderGPA(report) {
  const breadcrumb = document.querySelector('form#aspnetForm ol.breadcrumb')

  if (breadcrumb && breadcrumb.parentNode) {
    breadcrumb.parentNode.insertBefore(report, breadcrumb.nextSibling)
  }
}

function createReport({ gpa, semesterGrades }) {
  const report = document.createElement('div')
  report.classList.add('report')
  // Create report's header
  const header = document.createElement('div')
  header.classList.add('header')
  const stHeaderCol = document.createElement('div')
  stHeaderCol.classList.add('col__st')
  const ndHeaderCol = document.createElement('div')
  ndHeaderCol.classList.add('col__nd')
  const stHeaderContent = document.createTextNode('Semester')
  const ndHeaderContent = document.createTextNode(`Semester's Average`)
  stHeaderCol.appendChild(stHeaderContent)
  ndHeaderCol.appendChild(ndHeaderContent)
  header.appendChild(stHeaderCol)
  header.appendChild(ndHeaderCol)

  // Create report's body
  const body = document.createElement('div')
  body.classList.add('body')
  semesterGrades.forEach((s) => {
    const row = document.createElement('div')
    row.classList.add('row')
    const stBodyCol = document.createElement('div')
    stBodyCol.classList.add('col__st')
    const ndBodyCol = document.createElement('div')
    ndBodyCol.classList.add('col__nd')
    const stBodyContent = document.createTextNode(s.semester)
    const ndBodyContent = document.createTextNode(s.semesterGrade)
    stBodyCol.appendChild(stBodyContent)
    ndBodyCol.appendChild(ndBodyContent)
    row.appendChild(stBodyCol)
    row.appendChild(ndBodyCol)
    body.appendChild(row)
  })

  // Create report's footer
  const footer = document.createElement('div')
  footer.classList.add('footer')
  const stFooterCol = document.createElement('div')
  stFooterCol.classList.add('col__st')
  const ndFooterCol = document.createElement('div')
  ndFooterCol.classList.add('col__nd')
  const stFooterContent = document.createTextNode('GPA')
  const ndFooterContent = document.createTextNode(gpa)
  stFooterCol.appendChild(stFooterContent)
  ndFooterCol.appendChild(ndFooterContent)
  footer.appendChild(stFooterCol)
  footer.appendChild(ndFooterCol)

  // Complete report
  report.appendChild(header)
  report.appendChild(body)
  report.appendChild(footer)

  return report
}
