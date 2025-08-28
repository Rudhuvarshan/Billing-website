import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- CHANGED IMPORT

export const downloadBillPDF = (billData) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text("INVOICE", 105, 20, null, null, "center");

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text("Your Store Name", 20, 35);
  doc.text("Your Store Address, City", 20, 42);

  doc.text(`Bill To: ${billData.customerName}`, 20, 55);
  doc.text(`Contact: ${billData.customerNumber}`, 20, 62);
  
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 55, null, null, "right");
  
  const tableColumns = ["#", "Item Name", "Qty", "Price", "Total"];
  const tableRows = [];

  billData.items.forEach((item, index) => {
    const itemData = [
      index + 1,
      item.name,
      item.quantity,
      `₹${item.price.toFixed(2)}`,
      `₹${(item.price * item.quantity).toFixed(2)}`,
    ];
    tableRows.push(itemData);
  });

  // Call autoTable as a function, passing the doc object
  autoTable(doc, { // <-- CHANGED HOW WE CALL THE FUNCTION
    head: [tableColumns],
    body: tableRows,
    startY: 75 
  });
  
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(12);
  doc.text(`Subtotal:`, 150, finalY + 10, null, null, "right");
  doc.text(`₹${billData.subTotal.toFixed(2)}`, 190, finalY + 10, null, null, "right");
  
  doc.text(`Discount:`, 150, finalY + 17, null, null, "right");
  doc.text(`- ₹${billData.totalDiscountValue.toFixed(2)}`, 190, finalY + 17, null, null, "right");

  doc.text(`GST:`, 150, finalY + 24, null, null, "right");
  doc.text(`+ ₹${billData.totalGstValue.toFixed(2)}`, 190, finalY + 24, null, null, "right");
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total:`, 150, finalY + 31, null, null, "right");
  doc.text(`₹${billData.grandTotal.toFixed(2)}`, 190, finalY + 31, null, null, "right");

  doc.text("Thank you for your purchase!", 105, finalY + 50, null, null, "center");

  doc.save(`Bill-${billData.customerName.replace(" ", "_")}.pdf`);
};