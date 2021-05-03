import React from "react";
import OrderForm from "./OrderForm";

const OrderPage = () => {
  return (
    <div className="order-pg-cont">
      <section className="title-section">
        <h2 className="mP-title">Magic Potion #1</h2>
        <div className="img-cont" alt="Magic Potion with Sage on Desk"></div>
      </section>
      <section className="form-section">
        {/* controlled form component holding state */}
        <OrderForm />
      </section>
    </div>
  );
};

export default OrderPage;
