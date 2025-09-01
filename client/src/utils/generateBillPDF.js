import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- CHANGE 1: Import the function directly

const generateBillPDF = (billDetails) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('Invoice', 105, 20, null, null, 'center');
  doc.setFontSize(12);
  doc.text(`Bill ID: ${billDetails._id}`, 14, 30);
  doc.text(`Date: ${new Date(billDetails.createdAt).toLocaleString('en-IN')}`, 14, 36);

  // Customer Details
  doc.setFontSize(14);
  doc.text('Bill To:', 14, 50);
  doc.setFontSize(12);
  doc.text(`Customer Name: ${billDetails.customerName}`, 14, 56);
  doc.text(`Phone Number: ${billDetails.customerNumber}`, 14, 62);

  // Items Table
  const tableColumn = ["S.No.", "Product Name", "Qty", "Price", "Discount (%)", "GST (%)", "Total"];
  const tableRows = [];

  billDetails.items.forEach((item, index) => {
    const itemData = [
      index + 1,
      item.name,
      item.quantity,
      `Rs. ${item.price.toFixed(2)}`,
      `${item.discountPercentage}%`,
      `${item.gstPercentage}%`,
      `Rs. ${(item.price * item.quantity).toFixed(2)}`
    ];
    tableRows.push(itemData);
  });

  // <-- CHANGE 2: Call autoTable as a function, passing the doc
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 70,
  });

  // Totals Section
  const finalY = doc.lastAutoTable.finalY; // <-- CHANGE 3: Get Y position correctly
  doc.setFontSize(12);
  doc.text(`Sub Total: Rs. ${billDetails.subTotal.toFixed(2)}`, 14, finalY + 10);
  doc.text(`Total Discount: - Rs. ${billDetails.totalDiscountValue.toFixed(2)}`, 14, finalY + 16);
  doc.text(`Total GST: + Rs. ${billDetails.totalGstValue.toFixed(2)}`, 14, finalY + 22);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: Rs. ${billDetails.grandTotal.toFixed(2)}`, 14, finalY + 30);

  // Footer
  doc.setFontSize(10);
  doc.text('Thank you for your business!', 105, finalY + 50, null, null, 'center');

  // Save the PDF
  doc.save(`invoice-${billDetails._id}.pdf`);
};

export default generateBillPDF;