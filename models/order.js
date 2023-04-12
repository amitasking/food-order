const orders = []

module.exports = class Order {
    constructor(name, date , empId){
        this.name = name;
        this.date = date;
        this.empId = empId
    }

    save(){
        orders.push(this);
    }

    static fetchAllOrder(){
        return orders
    }
}