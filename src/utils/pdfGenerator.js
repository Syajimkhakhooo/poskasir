import jsPDF from 'jspdf';
import { formatCurrency, formatDateTime } from './formatters';

export const generateReceiptPDF = (transaction, storeName, customFooter = '') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 250], // Increased height for descriptions
  });

  let yPos = 10;
  const lineHeight = 4.5;
  const pageWidth = 80;
  const leftMargin = 5;
  const rightMargin = 75;

  // Header
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('STRUK PEMBAYARAN', pageWidth / 2, yPos, { align: 'center' });

  yPos += lineHeight * 1.5;
  doc.setFontSize(11);
  doc.text(storeName, pageWidth / 2, yPos, { align: 'center' });

  yPos += lineHeight;
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text(formatDateTime(transaction.createdAt), pageWidth / 2, yPos, { align: 'center' });

  yPos += lineHeight;
  doc.setFontSize(7);
  doc.text(`No: ${transaction.id}`, pageWidth / 2, yPos, { align: 'center' });

  yPos += lineHeight * 1.2;
  doc.text('='.repeat(50), leftMargin, yPos);

  // Items - using simpler layout to avoid overlap
  yPos += lineHeight;

  transaction.items.forEach((item, index) => {
    // Item name and quantity on first line
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');

    const itemName = item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name;
    doc.text(itemName, leftMargin, yPos);

    yPos += lineHeight;

    // Description if available
    if (item.description) {
      doc.setFont(undefined, 'italic');
      doc.setFontSize(7);
      const desc = item.description.length > 35 ? item.description.substring(0, 35) + '...' : item.description;
      doc.text(desc, leftMargin + 2, yPos);
      yPos += lineHeight;
    }

    // Price details on next line
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);

    const qty = item.quantity;
    const price = formatCurrency(item.price).replace('Rp', '').replace(/\s/g, '');
    const subtotal = formatCurrency(item.price * item.quantity).replace('Rp', '').replace(/\s/g, '');

    const priceText = `${qty} x ${price}`;
    doc.text(priceText, leftMargin + 2, yPos);
    doc.text(subtotal, rightMargin, yPos, { align: 'right' });

    yPos += lineHeight * 1.3;

    // Separator line between items (except last item)
    if (index < transaction.items.length - 1) {
      doc.setFontSize(7);
      doc.text('-'.repeat(50), leftMargin, yPos);
      yPos += lineHeight * 0.8;
    }
  });

  yPos += lineHeight * 0.5;
  doc.setFontSize(7);
  doc.text('='.repeat(50), leftMargin, yPos);

  // Total
  yPos += lineHeight * 1.2;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL:', leftMargin, yPos);

  const totalFormatted = formatCurrency(transaction.total);
  doc.text(totalFormatted, rightMargin, yPos, { align: 'right' });

  // Payment info
  if (transaction.payment) {
    yPos += lineHeight * 1.2;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.text('Bayar:', leftMargin, yPos);
    doc.text(formatCurrency(transaction.payment), rightMargin, yPos, { align: 'right' });

    yPos += lineHeight;
    doc.text('Kembali:', leftMargin, yPos);
    doc.text(formatCurrency(transaction.payment - transaction.total), rightMargin, yPos, { align: 'right' });
  }

  // Custom Footer (if provided)
  if (customFooter) {
    yPos += lineHeight * 2;
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');

    // Split by newlines and print each line
    const footerLines = customFooter.split('\n');
    footerLines.forEach(line => {
      if (line.trim()) {
        doc.text(line.trim(), pageWidth / 2, yPos, { align: 'center' });
        yPos += lineHeight;
      }
    });
  }

  // Footer
  yPos += lineHeight * 2;
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('Terima kasih atas kunjungan Anda!', pageWidth / 2, yPos, { align: 'center' });

  yPos += lineHeight;
  doc.text('Barang yang sudah dibeli', pageWidth / 2, yPos, { align: 'center' });

  yPos += lineHeight;
  doc.text('tidak dapat dikembalikan', pageWidth / 2, yPos, { align: 'center' });

  // Save PDF
  doc.save(`struk-${transaction.id}.pdf`);
};
