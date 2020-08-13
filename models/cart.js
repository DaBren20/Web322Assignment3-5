module.exports = function Cart(old) {
    this.items = old.items || {};
    this.totalQty = old.totalQty || 0;
    this.totalPrice = old.totalPrice || 0;

    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem)
        {
            storedItem = this.items[id] = {item: item, quantity: 0, price: 0};
        }
        storedItem.quantity++;
        storedItem.price = storedItem.item.price * storedItem.quantity;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }
    this.genArray = function(){
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};