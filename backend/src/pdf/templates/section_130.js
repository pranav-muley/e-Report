module.exports = function notice130Template(doc, data) {
    doc
      .fontSize(14)
      .text("कारणे दाखवा नोटीस", { align: "center" })
  
    doc.moveDown(2)
  
    doc.fontSize(11)
    doc.text(`प्रकरण क्रमांक: ${data.caseNumber}`)
    doc.text(`पोलीस स्टेशन: ${data.policeStation}`)
  
    doc.moveDown()
  
    doc.text(`नाव: ${data.personName}`)
    doc.text(`पत्ता: ${data.address}`)
  
    doc.moveDown(2)
  
    doc.text(data.body, {
      align: "justify",
      lineGap: 4
    })
  
    doc.moveDown(4)
    doc.text("स्वाक्षरी:")
    doc.text("अधिकारी नाव")
  }  