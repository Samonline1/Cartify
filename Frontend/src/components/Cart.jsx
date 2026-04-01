import React, { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const Cart = () => {

  console.log(document.cookie);


  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // fetch cart items
  const fetchCart = async () => {

    
    try {
      const res = await API.get(
        `/products/cart/all`
      );
// console.log(res.data);

      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // fetch total
  const fetchTotal = async () => {
    try {
      const res = await API.get(
        "/products/cart/total"
      );

      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching total:", err);
    }
  };

  // delete product 

  const deleteItem = async (id)=> {
    
    try {
      const pId = id
      const res = await API.delete(
        `/products/cart/${pId}`
      );

      const {msg} = res.data;
      // console.log(msg);

      toast.success(msg || "Product removed!", {
      position: "bottom-center",
      autoClose: 5000
    });

fetchCart() 

    } catch (err) {
      console.error("Error fetching total:", err);
    }
    
  }

  useEffect(() => {
    fetchCart();
    fetchTotal();
  }, []);


   if (!cart || !total) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <p>Cart is Empty..</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 text-slate-900 px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* CART ITEMS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 text-sm font-semibold border-b">
            Your Cart ({cart.length})
          </div>

          <div className="divide-y">
            {cart.length > 0 ? (
              [...cart].reverse().map((item) => (
                <div
                onClick={() => navigate(`/search/${item.title}/${item.id}`)}
                  key={item.id}                  
                  className=" flex items-center justify-between px-6 py-5"

                >
                  {/* left */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-16 w-16 object-contain"
                    />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* right */}
               <div className="flex gap-3">
                   <p className="font-semibold">
                    ₹{(item.price * item.quantity * 80).toFixed(0)}
                  </p>
                  <p className="text-red-800 font-bold cursor-pointer" onClick={()=> deleteItem(item.id)}>X</p>
               </div>
                </div>
              ))
            ) : (
              <p className="p-6 text-slate-500">Cart is empty</p>
            )}
          </div>
        </div>

        {/* TOTAL */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{(total * 80).toFixed(0)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;