import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCart from "../../../hooks/useCart";

const CheckOutFrom = () => {
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState('')
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [cart] = useCart();
  const TotalPrice = cart.reduce((total, item) => total + item.price, 0);
  useEffect( () => {
     axiosSecure.post("/create-payment-intent", { price: TotalPrice})
     .then(res =>{
        console.log(res.data.clientSecret);
        setClientSecret(res.data.clientSecret)
     })

  }, [axiosSecure, TotalPrice]);
  const handelSubmit = async (event) => {
    event.preventDefault();

    const card = elements.getElement(CardElement);
    if (!stripe || !elements) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("payment error", error);
      setError(error.message);
    } else {
      console.log("payment method ", paymentMethod);
      setError("");
    }
  };
  return (
    <form onSubmit={handelSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <button
        className="btn btn-sm btn-primary my-4 "
        type="submit"
        disabled={!stripe || !clientSecret}
      >
        Pay
      </button>
      <p className="text-red-600">{error}</p>
    </form>
  );
};

export default CheckOutFrom;
