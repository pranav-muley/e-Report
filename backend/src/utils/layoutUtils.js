function labeledRow(doc, label, value) {
    doc
      .fontSize(11)
      .text(`${label}: `, { continued: true, width: 180 })
      .fontSize(11)
      .text(value || "-", { continued: false })
  }
  
  function formatDate(date) {
    if (!date) return "-"
    const d = new Date(date)
    return d.toLocaleDateString("mr-IN")
  }
  
  function drawProceedingsTable(doc, proceedings = []) {
    if (!proceedings.length) {
      doc.text("कोणतीही कार्यवाही नोंद नाही")
      return
    }
  
    proceedings.forEach((p, index) => {
      doc
        .fontSize(11)
        .text(
          `${index + 1}. ${formatDate(p.date)} - ${p.description} (${p.officerName})`,
          {
            align: "left"
          }
        )
    })
  }
  
  module.exports = {
    labeledRow,
    formatDate,
    drawProceedingsTable
  }  