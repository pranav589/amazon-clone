import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import "../../../styles/cart.css";
import axios from "axios";
import PaypalButton from "./PaypalButton";
import StripeCheckout from "react-stripe-checkout";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
// import './Cart.css'

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51KP2h3SJSZkjo118oHaM4govZoMOJX54WjbFjiax1rNlZbXzb65ZAefr7nqxx16OIlrCVtBXROJv5AfnJZe3kqk200MupJcEpQ"
);

function Cart() {
  const [clientSecret, setClientSecret] = useState("");
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);
  //console.log(cart)

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };

    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };

  const tranSuccess = async (payment) => {
    console.log(payment);
    const { paymentID, address } = payment;

    const res = await axios.post(
      "/api/payment",
      { cart, paymentID, address },
      {
        headers: { Authorization: token },
      }
    );

    console.log(res);

    setCart([]);
    addToCart([]);
    alert("You have successfully placed an order.");
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart Empty</h2>
    );

  // const handleToken = async (tokenData) => {
  //   const product = { name: "All products", price: total };
  //   try {
  //     console.log(tokenData);
  //     const res = await axios.post(
  //       "/api/payment",
  //       { product, tokenData, paymentMethod: "card" },
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //     console.log("end");
  //     console.log(res);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const [clientSecret, setClientSecret] = useState("");

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch("/create-payment-intent", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  // }, []);

  // const appearance = {
  //   theme: "stripe",
  // };
  // const options = {
  //   clientSecret,
  //   appearance,
  // };

  return (
    <div>
      {cart.map((product) => (
        // <img src={product.images.url} alt=""/>
        // console.log(product.images.url)
        <div className="detail cart" key={product._id}>
          <img src={product.images.url} alt="" />

          <div className="box-detail">
            <h2>{product.title}</h2>

            <h3>$ {product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.content}</p>

            <div className="amount">
              <button onClick={() => decrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> + </button>
            </div>

            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}

      <div className="total">
        <h3>Total: $ {total}</h3>
        {/* {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )} */}
        {/* <Elements stripe={stripePromise}>
          <Card />
        </Elements> */}
        {/* <StripeCheckout
          stripeKey="pk_test_51KP2h3SJSZkjo118oHaM4govZoMOJX54WjbFjiax1rNlZbXzb65ZAefr7nqxx16OIlrCVtBXROJv5AfnJZe3kqk200MupJcEpQ"
          token={handleToken}
          billingAddress
          shippingAddress
          amount={total * 100}
          name="All products"
        ></StripeCheckout> */}
        <PaypalButton total={total} tranSuccess={tranSuccess} />
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import {
//   PaymentElement,

// } from "@stripe/react-stripe-js";

// export default function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!stripe) {
//       return;
//     }

//     const clientSecret = new URLSearchParams(window.location.search).get(
//       "payment_intent_client_secret"
//     );

//     if (!clientSecret) {
//       return;
//     }

//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       switch (paymentIntent.status) {
//         case "succeeded":
//           setMessage("Payment succeeded!");
//           break;
//         case "processing":
//           setMessage("Your payment is processing.");
//           break;
//         case "requires_payment_method":
//           setMessage("Your payment was not successful, please try again.");
//           break;
//         default:
//           setMessage("Something went wrong.");
//           break;
//       }
//     });
//   }, [stripe]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       // Stripe.js has not yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }

//     setIsLoading(true);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         // Make sure to change this to your payment completion page
//         return_url: "http://localhost:3000",
//       },
//     });

//     // This point will only be reached if there is an immediate error when
//     // confirming the payment. Otherwise, your customer will be redirected to
//     // your `return_url`. For some payment methods like iDEAL, your customer will
//     // be redirected to an intermediate site first to authorize the payment, then
//     // redirected to the `return_url`.
//     if (error.type === "card_error" || error.type === "validation_error") {
//       setMessage(error.message);
//     } else {
//       setMessage("An unexpected error occured.");
//     }

//     setIsLoading(false);
//   };

//   return (
//     <form id="payment-form" onSubmit={handleSubmit}>
//       <PaymentElement id="payment-element" />
//       <button disabled={isLoading || !stripe || !elements} id="submit">
//         <span id="button-text">
//           {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
//         </span>
//       </button>
//       {/* Show any error or success messages */}
//       {message && <div id="payment-message">{message}</div>}
//     </form>
//   );
// }
// function Cart() {
//   const state = useContext(GlobalState);
//   const [cart,setCart] = state.userAPI.cart;
//   const [token]=state.token
//   const [total, setTotal] = useState(0);

// console.log(cart)
//   useEffect(() => {
//     const getTotal = () => {
//       const total = cart.reduce((prev, item) => {
//         return prev + item.price * item.quantity;
//       }, 0);
//       setTotal(total);
//     };

//     getTotal();
//   }, [cart]);

//   const addToCart=async (cart)=>{
//     await  axios.patch('/user/addCart',{cart},{
//         headers:{Authorization:token}
//     })
//   }

//   const increment=(id)=>{
//       cart.forEach(item=>{
//           if(item._id===id){
//               item.quantity +=1
//           }
//       })
//       setCart([...cart])
//       addToCart(cart)
//   }

//   const decrement=(id)=>{
//     cart.forEach(item=>{
//         if(item._id===id){
//             item.quantity ===1 ? item.quantity=1 : item.quantity-=1
//         }
//     })
//     setCart([...cart])
//     addToCart(cart)
// }

//   const removeProduct=id=>{
//       if(window.confirm("Do you want to remove this product from the cart?")){
//           cart.forEach((item,index)=>{
//               if(item._id===id){
//                   cart.splice(index,1)
//               }
//           })
//           setCart([...cart])
//       }
//       addToCart(cart)
//   }

//   const tranSuccess=async(payment)=>{
//       const {paymentID,address}=payment
//       await axios.post('/api/payment',{cart,paymentID,address},{
//           headers:{Authorization:token}
//       })
//       setCart([])
//       addToCart([])
//       alert("You have successfully placed the order!!")

//   }

//   if (cart.length === 0)
//     return (
//       <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart Empty</h2>
//     );

//   {
//     return (
//       <div>
//         {cart.map((product) => (
//           <div className="detail cart" key={product._id}>
//             <img src={product.images.url} alt={product.title} />
//             <div className="box__detail">
//               <h2>{product.title}</h2>
//               <h3>$ {product.price * product.quantity}</h3>
//               <p>{product.description}</p>
//               <p>{product.content}</p>
//               <div className="amount">
//                 <button onClick={()=>decrement(product._id)}>-</button>
//                 <span>{product.quantity}</span>
//                 <button onClick={()=>increment(product._id)}>+</button>
//               </div>
//               <div className="delete" onClick={()=>removeProduct(product._id)}>x</div>
//             </div>
//           </div>
//         ))}
//         <div className="total">
//           <h3>Total: $ {total}</h3>
//           <PaypalButton total={total} tranSuccess={tranSuccess}/>
//         </div>
//       </div>
//     );
//   }
// }

export default Cart;
