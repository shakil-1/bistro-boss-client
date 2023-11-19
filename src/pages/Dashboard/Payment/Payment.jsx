import { loadStripe } from "@stripe/stripe-js";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutFrom from "./CheckOutFrom";


// TODO: add publisebol key
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);
const Payment = () => {
   
  return (
    <div>
      <SectionTitle
        heading="Payment"
        subHeading="Please pay to eat!"
      ></SectionTitle>
      <div>
        <Elements stripe={stripePromise}>
          <CheckOutFrom></CheckOutFrom>
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
