import React, { useState, useEffect } from "react";
import { postOrder } from "../Services/api";
const OrderForm = () => {
  // form state capturing user input
  const [formFields, setFormFields] = useState({
    email: "",
    quantity: "",
    total: 0,
    payment: {
      credit_card_number: "",
      credit_card_exp: "",
    },
  });
  // error state capturing errors
  const [formErrors, setFormErrors] = useState({});
  // credit card constant for card-validation
  const valid = require("card-validator");
  // automatically update total based off changes in quantity field
  useEffect(() => {
    let newTotal = formFields.quantity * 49.99;
    setFormFields((prev) => ({ ...prev, total: newTotal }));
  }, [formFields.quantity]);
  // capture changes in input field and dynamically update form state
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "ccNum") {
      setFormFields((prev) => ({
        ...prev,
        payment: { ...prev.payment, credit_card_number: value },
      }));
    } else if (name === "exp") {
      setFormFields((prev) => ({
        ...prev,
        payment: { ...prev.payment, credit_card_exp: value },
      }));
    } else {
      let fields = { ...formFields, quantity: parseInt(formFields.quantity) };
      fields[name] = value;
      setFormFields({ ...fields });
    }
  };

  // Submit data to magic api
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      debugger;
      postOrder({ order: formFields })
        .then((json) => {
          if (json.error) {
            // render backend failures to input fields Ui by setting form error state
            let errors = {};
            for (let key of Object.keys(json.error)) {
              errors[key] = json.error[key][0];
            }
            setFormErrors(errors);
            // alert user with all failed verifications
            alert(json.message);
          } else {
            // clear form state to original state
            setFormFields({
              email: "",
              quantity: "",
              total: 0,
              payment: {
                credit_card_number: "",
                credit_card_exp: "",
              },
            });
            // render success alert
            alert(`${json.message} Order ID: ${json.id}`);
          }
        })
        .catch((err) => console.log("catch", err));
    } else {
      console.log("invalid fields");
    }
  };

  // validate inputs to form
  const validateFields = () => {
    let isValid = true;
    let errors = {};
    for (let key of Object.keys(formFields)) {
      switch (key) {
        case "quantity":
          // verify quantity is within range
          if (!(0 < formFields.key < 4)) {
            isValid = false;
            errors["quantity"] =
              "Please enter a quantity amount between 1 and 3.";
          }
          break;
        case "email":
          // use Regex for first email verification
          const pattern = new RegExp(
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
          );
          if (!pattern.test(formFields.email)) {
            isValid = false;
            errors["email"] = "Please enter a valid email address.";
          } else {
            errors["email"] = false;
          }
          break;
        case "payment":
          // use credit-validation library to validate credit card number
          let ccReport = valid.number(formFields.payment.credit_card_number);
          if (!ccReport.isValid) {
            isValid = false;
            errors["credit_card_number"] =
              "Please enter a valid Credit Card number.";
          } else {
            errors["credit_card_number"] = false;
          }
          // use credit-validation library to validate credit card exp
          let expReport = valid.expirationDate(
            formFields.payment.credit_card_exp
          );
          if (!expReport.isValid) {
            isValid = false;
            errors["credit_card_exp"] =
              "Please enter a valid Expiration Date (MM/YY).";
          } else {
            errors["credit_card_exp"] = false;
          }
          break;
        default:
          break;
      }
    }
    // if errors -> set form error state to errors to activate Ui indicators and messages
    errors && setFormErrors(errors);
    return isValid;
  };

  return (
    <div className="form-cont">
      <form className="order-form" onSubmit={handleFormSubmit}>
        <h2 id="order-header">Your Order</h2>
        <div className="your-order-sect">
          <div id="qty-section">
            <div>
              <h3 id="qty" className="field-title">
                Qty*
              </h3>
              <input
                id="qty-field"
                className={
                  formErrors.quantity ? "input-field-error-box" : "input-field"
                }
                name="quantity"
                required
                placeholder="Max 3"
                type="number"
                max="3"
                min="1"
                onChange={handleChange}
                value={formFields.quantity}
              ></input>
            </div>
            {formErrors.quantity && (
              <p className="input-error">{formErrors.quantity}</p>
            )}
          </div>
          <div id="total-price-section">
            <h3 id="total-price" className="field-title">
              Total Price
            </h3>
            <input
              id="total-price-field"
              className="input-field"
              name="total"
              type="number"
              placeholder="0.00"
              readOnly={true}
              value={formFields.quantity > 0 && formFields.total}
            ></input>
          </div>
        </div>

        <div className="divider" />

        <h2 id="contact-header">Contact</h2>
        <div className="contact-sect">
          <h3 id="contact-title" className="field-title">
            Email Address
          </h3>
          <input
            id="contact-field"
            className={
              formErrors.email ? "input-field-error-box" : "input-field"
            }
            name="email"
            minLength="6"
            required
            placeholder="Email Address"
            type="email"
            onChange={handleChange}
            value={formFields.email}
          ></input>
          {formErrors.email && (
            <p className="input-error">{formErrors.email}</p>
          )}
        </div>

        <div className="divider" />

        <h2 id="billing-header">Billing Information</h2>
        <div className="billing-sect">
          <div id="ccNum-section">
            <div>
              <h3 id="ccNum-title" className="field-title">
                Credit Card Number
              </h3>
              <input
                id="ccNum-field"
                className={
                  formErrors.cc ? "input-field-error-box" : "input-field"
                }
                name="ccNum"
                minLength="16"
                maxLength="16"
                size="16"
                required
                placeholder="Credit Card Number"
                onChange={handleChange}
                value={formFields.payment.credit_card_number}
              ></input>
            </div>
            {formErrors.credit_card_number && (
              <p className="input-error">{formErrors.credit_card_number}</p>
            )}
          </div>
          <div id="exp-date-section">
            <div>
              <h3 id="exp-date-title" className="field-title">
                Expiration Date
              </h3>
              <input
                id="exp-date-field"
                className={
                  formErrors.credit_card_exp
                    ? "input-field-error-box"
                    : "input-field"
                }
                name="exp"
                maxLength="5"
                required
                placeholder="mm/yy"
                onChange={handleChange}
                value={formFields.payment.credit_card_exp}
              ></input>
            </div>
            {formErrors.credit_card_exp && (
              <p className="input-error">{formErrors.credit_card_exp}</p>
            )}
          </div>
        </div>

        <div className="divider" />

        <div className="button-sect">
          <button id="order-btn" data-testid="order-btn" type="submit">
            <p id="btn-text" data-testid="order-btn-txt">
              PLACE YOUR ORDER
            </p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
