export class OrderInfoModel {
    constructor() {
      this.id = 0;
      this.comment = '';
      this.deliveryAddress = '';
      this.deliveryTime = '';
      this.orderingTime = '';
      this.totalPrice = 0;
      this.isDelivered = false;
      this.customer = '';
      this.status = 0;
    }
  }