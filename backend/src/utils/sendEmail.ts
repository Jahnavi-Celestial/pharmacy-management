import sgMail from "@sendgrid/mail"
import "dotenv/config";

sgMail.setApiKey(String(process.env.SENDGRID_API_KEY))

export async function sendEmailWithPdf(recipientEmail: string, invoiceNumber: string, pdfBuffer: Buffer){
    try{
        const message = {
            to: recipientEmail,
            from: String(process.env.MY_MAIL),
            subject: `Your Invoice ${invoiceNumber}`,
            text: `Thank you for your purchase. Please find your invoice attached.`,
            attachments: [
                {
                    filename: `${invoiceNumber}.pdf`,
                    content: pdfBuffer.toString('base64'),
                    type: "application/pdf",
                    disposition: "attachment"
                },
            ]
        }

        const res = await sgMail.send(message)

        console.log("mail sent")
        return res
    }
    catch(err:any){
        console.log(err.message)
    }
}