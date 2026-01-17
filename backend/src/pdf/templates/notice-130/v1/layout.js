// templates/notice-130/v1/layout.js

module.exports.render = function renderNotice130(doc, data, text) {
    // Header
    doc.fontSize(14).text(text.header.department, { align: "center" })
    doc.text(text.header.office, { align: "center" })
    doc.moveDown(2)
  
    // Title
    doc.fontSize(16).text(text.title, { align: "center", underline: true })
    doc.moveDown(1)
  
    // Section reference
    doc.fontSize(12).text(text.sectionRef, { align: "center" })
    doc.moveDown(2)
  
    // Opening
    doc.fontSize(12).text(text.opening)
    doc.moveDown(1)
  
    // Dynamic facts
    doc.text(
      `${data.accused.name}, ${data.accused.address} यांनी ${data.facts}`,
      { align: "justify" }
    )
    doc.moveDown(2)
  
    // Direction
    doc.text(
      `${text.direction} दिनांक ${data.hearing.date} रोजी ${data.hearing.place} येथे.`,
      { align: "left" }
    )
    doc.moveDown(3)
  
    // Footer
    doc.text(`(${data.officer.name})`, { align: "right" })
    doc.text(data.officer.designation, { align: "right" })
  }  