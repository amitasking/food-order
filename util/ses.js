const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const fs = require('fs');
var mimemessage = require('mimemessage');
const AWS = require("aws-sdk");
// Set the AWS Region.
const REGION = "us-east-1";
// Create SES service object.
const sesClient = new SESClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId:'',
        secretAccessKey: ''
      }
});


createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
        Destination: {
            /* required */
            CcAddresses: [
                /* more items */
            ],
            ToAddresses: [
                toAddress,
                /* more To-email addresses */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: "HTML_FORMAT_BODY",
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "TEXT_FORMAT_BODY",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "EMAIL_SUBJECT",
            },
        },
        Attachments: [
            {
              Filename: "orders.txt", // Replace with the desired filename for the attachment
              Content: fs.readFileSync('./orders.xlsx'),
            },
          ],

        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    });
};


module.exports.sendRawMail = async () => {
    AWS.config.update({
        accessKeyId: "",
        secretAccessKey: "",
        region: "us-east-1", // Replace with your desired region
      });
      
    const ses2 = new AWS.SES();
   const to = "amit423raja@gmail.com"
   const from = "cu.17bcs1685@gmail.com"
    const subject = 'orders'
    const message = "hello"
  // Read the attachment file contents
  const attachmentFilePath = "./orders.xlsx"; // Replace with the path to your attachment file
  const attachmentContent = fs.readFileSync(attachmentFilePath);

  // Construct the raw email data
  const rawEmail = `From: ${from}
To: ${to}
Subject: ${subject}
Content-Type: multipart/mixed; boundary="boundary"

--boundary
Content-Type: text/plain

${message}

--boundary
Content-Type: text/plain; name="orders.xlsx"
Content-Disposition: attachment; filename="orders.xlsx"
Content-Transfer-Encoding: base64

${attachmentContent.toString("base64")}

--boundary--`;

  // Set the parameters for the SES SendRawEmail operation
  const params = {
    RawMessage: {
      Data: rawEmail,
    },
  };




    // var mailContent = mimemessage.factory({ contentType: 'multipart/mixed', body: [] });
    // mailContent.header('From', 'amit423raja@gmail.com');
    // mailContent.header('To', 'amit423raja@gmail.com');
    // mailContent.header('Subject', 'Customer service contact info');
    // var alternateEntity = mimemessage.factory({
    //     contentType: 'multipart/alternate',
    //     body: []
    // });
    // var htmlEntity = mimemessage.factory({
    //     contentType: 'text/html;charset=utf-8',
    //     body: '   <html>  ' +
    //         '   <head></head>  ' +
    //         '   <body>  ' +
    //         '   <h1>Hello!</h1>  ' +
    //         '   <p>Please see the attached file for a list of    customers to contact.</p>  ' +
    //         '   </body>  ' +
    //         '  </html>  '
    // });
    // var plainEntity = mimemessage.factory({
    //     body: 'Please see the attached file for a list of    customers to contact.'
    // });
    // alternateEntity.body.push(htmlEntity);
    // alternateEntity.body.push(plainEntity);
    // mailContent.body.push(alternateEntity);
    // var data = fs.readFileSync('./app.js');
    // var attachmentEntity = mimemessage.factory({
    //     contentType: 'text/plain',
    //     contentTransferEncoding: 'base64',
    //     body: data.toString('base64').replace(/([^\0]{76})/g, "$1\n")
    // });
    // attachmentEntity.header('Content-Disposition', 'attachment ;filename="orders.xlsx"');

    // const params = {
    //     RawMessage: {
    //       Data: mailContent.toString() ,
    //     },
    //   };

      await ses2.sendRawEmail(params).promise().then(re => {

          return ("Email sent successfully");
      });
  
}


module.exports.run = async () => {
    const sendEmailCommand = createSendEmailCommand(
        "amit423raja@gmail.com",
        "amit423raja@gmail.com"
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (e) {
        console.error(e);
        return e;
    }
};

