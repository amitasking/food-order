const XLSX = require('xlsx');
const path = require('path');

// Sheet header names

module.exports.exportOrdersToExcel = (OrderList, workSheetColumnNames, filePath) => {
    const lunch = [];
    const dinner = [];
    OrderList.map(order => {
        order.FoodItem.menuType === 'lunch' ? lunch.push([order.empId, 
            order.FoodItem.name
        ]) 
        : dinner.push([order.empId,  
            order.FoodItem.name
        ]);
    });
   
    const workBook = XLSX .utils.book_new(); //Create a new workbook
    const lunchWorkSheetData = [
        workSheetColumnNames,
        ...lunch
    ];

    const dinnerWorkSheetData = [
        workSheetColumnNames,
        ...dinner
    ];
    
    const lunchWorkSheet = XLSX.utils.aoa_to_sheet(lunchWorkSheetData);
    const dinnerWorkSheet = XLSX.utils.aoa_to_sheet(dinnerWorkSheetData);
   
    XLSX.utils.book_append_sheet(workBook, lunchWorkSheet, 'Lunch Orders');
    XLSX.utils.book_append_sheet(workBook, dinnerWorkSheet, 'Dinner Orders');
    XLSX.writeFile(workBook, path.resolve(filePath));
    return true;

}
