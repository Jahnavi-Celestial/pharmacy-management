import PDFDocument from 'pdfkit';

function createPdf(dataCallBack: any, endCallback: any, invoice: any){
    const doc = new PDFDocument();

    doc.on('data', dataCallBack);
    doc.on('end', endCallback);

    doc.fontSize(20)
       .text("ABC Medical Store", {
            align: "center"
       });

    doc.fontSize(11)
       .text("Delhi, India", {
            align: "center"
       });

    doc.moveDown();

    doc.text(`Invoice No : ${invoice.invoiceNumber}`);
    doc.text(`Date : ${invoice.date}`);
    doc.text(`Customer : ${invoice.customerName}`);
    doc.text(`Phone : ${invoice.phone}`);

    doc.moveDown();

    doc.text(
        "-------------------------------------------------------------"
    );

    doc.text(
        "Medicine          Qty      Price      Discount      Total"
    );

    doc.text(
        "-------------------------------------------------------------"
    );

    invoice.items.forEach((item: any) => {

        doc.text(
            `${item.name}     ${item.quantity}      ₹${item.price}      ${item.discount}%      ₹${item.total}`
        );

    });

    doc.moveDown();

    doc.text(
        "-------------------------------------------------------------"
    );

    doc.font("Helvetica-Bold")
       .text(`Grand Total : ₹${invoice.total}`);

    doc.moveDown();

    doc.font("Helvetica")
       .text("Thank you for visiting!", {
            align: "center"
       });

    doc.end();
}

export default createPdf;