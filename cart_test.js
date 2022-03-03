
const API_URL="https://my-bank.com/api";

export default class Cart {

    itemsInCart = [];

    constructor(initialItems = []) {
        this.itemsInCart = initialItems;
    }

    get items() {
        return [...this.itemsInCart]; // Cart should be immutable
    }

    get total() {
        return this.itemsInCart.map(item => item.price).reduce((acc, i) => acc + i, 0);
    }

    isEmpty() {
        return this.itemsInCart.length == 0;
    }

    addItem(item) {
        return new Cart([...this.itemsInCart, item]); // Cart should be immutable
    }

    removeItem(item) {
        return new Cart(this.itemsInCart.filter(elt => elt.id != item.id)); // Cart should be immutable
    }

    async pay() {
        console.log(`fetch("${API_URL}/payment?amount=${this.total}", {method: "POST"})`);
    }
}

