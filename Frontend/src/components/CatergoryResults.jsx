import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce } from "react-toastify";
import API from "../api";

// category results
const CategoryResults = () => {
  // const users = JSON.parse(localStorage.getItem("users"));
  // route param
  const { name } = useParams();
  

  // product data
  const [products, setProducts] = useState([]);
  // active filters
  const [filters, setFilters] = useState([]);
  // filtered list
  const [filData, setFilData] = useState();

  useEffect(() => {
    // load products
    const searchResults = async () => {
      if (!name) return;

      try {
        const res = await toast.promise(
          API.get(`/products/category/${name}`),
          {
            loading: "Loading products...",
            error: "Failed to load products",
            success: "Products loaded successfully",
          }
        );

        setProducts(res.data || []);
      } catch (error) {
        console.error("No products found...", error);
        setProducts([]);
      }
    };

    searchResults();
  }, [name]);

  const navigate = useNavigate();

  // filter toggle
  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    const updatedFilters = checked
      ? [...filters, value]
      : filters.filter((f) => f !== value);
    setFilters(updatedFilters);
  };

  useEffect(() => {
    // apply filters
    if (filters.length === 0) {
      setFilData(products);
      return;
    }

    const filtered = products.filter((product) => {
      const price = product.price * 80;
      const discount = product.discountPercentage;
      const shipment = product.shippingInformation;

      return filters.some((f) => {
        if (f === "Ships overnight") return shipment === "Ships overnight";
        if (f === "Under ₹1,000") return price < 1000;
        if (f === "₹1,000 - ₹5,000") return price >= 1000 && price <= 5000;
        if (f === "₹5,000 - ₹10,000") return price >= 5000 && price <= 10000;
        if (f === "₹10,000 - ₹20,000") return price >= 10000 && price <= 20000;
        if (f === "Over ₹20,000") return price > 20000;

        if (f === "10% Off or more") return discount >= 10;
        if (f === "25% Off or more") return discount >= 25;
        if (f === "35% Off or more") return discount >= 35;
        if (f === "50% Off or more") return discount >= 50;
        if (f === "60% Off or more") return discount >= 60;
        if (f === "70% Off or more") return discount >= 70;

        return false;
      });
    });

    setFilData(filtered);
  }, [products, filters]);


  // add cart
 async function addtoCart(id) {

  console.log(id);
  
  if (!id) return;

  try {
    const res = await API.post(
      `/products/cart/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        withCredentials: true
      }
    );

    console.log(res.data);

    const { msg, item } = res.data;

    const cartItem = {
      productId: item.productId,
      quantity: item.quantity
    };

    console.log(cartItem);

    toast.success(msg || "Added to cart!", {
      position: "bottom-center",
      autoClose: 5000
    });

  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

  // render products
  return (
    <div className="w-full min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-10 py-6">
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        <div className="hidden lg:block w-full max-w-xs bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <b>Filter By</b>

          <h3 className="mt-4 font-semibold">Sort by</h3>
          <label className="block">
            <input
              className="appearance-none w-5 h-5 rounded-full border-2 border-gray-400 bg-white
                 checked:bg-blue-600 checked:border-blue-600 
                 focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all duration-200"
              type="checkbox"
              value={"Ships overnight"}
              checked={filters.includes("Ships overnight")}
              onChange={handleCheckboxChange}
            />{" "}
            {"Ships overnight"}
          </label>

          <h3 className="mt-2 font-semibold">Price</h3>
          {[
            "Under ₹1,000",
            "₹1,000 - ₹5,000",
            "₹5,000 - ₹10,000",
            "₹10,000 - ₹20,000",
            "Over ₹20,000",
          ].map((label) => (
            <label key={label} className="block">
              <input
                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-400 bg-white
                 checked:bg-blue-600 checked:border-blue-600 
                 focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all duration-200"
                type="checkbox"
                value={label}
                checked={filters.includes(label)}
                onChange={handleCheckboxChange}
              />{" "}
              {label}
            </label>
          ))}

          <h3 className="mt-4 font-semibold">Discount</h3>
          {[
            "10% Off or more",
            "25% Off or more",
            "35% Off or more",
            "50% Off or more",
            "60% Off or more",
            "70% Off or more",
          ].map((label) => (
            <label key={label} className="block">
              <input
                className="appearance-none w-5 h-5 rounded-full border-2 border-gray-400 bg-white
                 checked:bg-blue-600 checked:border-blue-600 
                 focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all duration-200"
                type="checkbox"
                value={label}
                checked={filters.includes(label)}
                onChange={handleCheckboxChange}
              />{" "}
              {label}
            </label>
          ))}
        </div>

        <div className="flex-1">
          {filData && filData.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filData.map((f, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition flex gap-3 p-4"
                >
                  <div
                    className="h-24 w-24 sm:h-28 sm:w-28 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer"
                    onClick={() => navigate(`/search/${name}/${f.id}`)}
                  >
                    <img
                      className="h-full w-full object-contain"
                      src={f?.images[0]}
                      alt={f.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-base font-semibold text-slate-900 line-clamp-2">
                      {f.title}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {f.description || "Great choice for your collection"}
                    </p>
                    <p className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                      ⭐ {f.rating} · {f.reviews?.length || 0}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">
                        ₹{(f.price * 80).toFixed(0)}
                      </span>
                      <span className="text-sm line-through text-slate-400">
                        ₹
                        {(
                          (f.price / 100) * 80 * f.discountPercentage +
                          f.price * 80
                        ).toFixed(0)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Ships: {f.shippingInformation || "See details"}
                    </p>
                    <button
                      onClick={() => addtoCart(f.id)}
                      className="mt-1 w-full rounded-full bg-slate-900 text-white font-semibold py-2 hover:bg-slate-800 transition"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center bg-white rounded-2xl p-10 text-slate-700">
              No products found for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryResults;
