const XLSX = require('xlsx');
const path = require('path');
const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand
} = require('@aws-sdk/client-s3');
const fs = require("fs");
const { sendRawMail } = require('../util/ses');
// Sheet header names

const client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId:'',
        secretAccessKey: ''
      }
});

module.exports.exportOrdersToExcel = (OrderList, workSheetColumnNames, filePath,res) => {
    
    const orders = [];
    OrderList.map(order => {
        orders.push([order.empId,  
            order.FoodItem.name
        ]);
    });
   
    const workBook = XLSX .utils.book_new(); //Create a new workbook
    const ordersWorkSheetData = [
        workSheetColumnNames,
        ...orders
    ];

    // const dinnerWorkSheetData = [
    //     workSheetColumnNames,
    //     ...dinner
    // ];
    
    const lunchWorkSheet = XLSX.utils.aoa_to_sheet(ordersWorkSheetData);
    //const dinnerWorkSheet = XLSX.utils.aoa_to_sheet(dinnerWorkSheetData);
   
    XLSX.utils.book_append_sheet(workBook, lunchWorkSheet, 'Orders');
  //  XLSX.utils.book_append_sheet(workBook, dinnerWorkSheet, 'Dinner Orders');

    var wopts = { bookType:"xlsx", bookSST:false, type:"base64" };

     var wbout = XLSX.write(workBook,wopts);
     

      XLSX.writeFile(workBook, path.resolve(filePath));
        uploadFileToS3(wbout)

    // return wbout
    // res.send({})

}



const uploadFileToS3 = async (buff) => {
    sendRawMail().then(res =>{
        console.log(res);
    })
    // const command = new PutObjectCommand({
    //     Bucket: "food-order-orders",
    //     Body: Buffer.from(buff, 'base64'),
    //     Key: 'orderfile',
    //     ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    // });

    // try {
    //     const response = await client.send(command);
    //      return (response);
    // } catch (err) {
    //     console.error(err);
    // }
}
