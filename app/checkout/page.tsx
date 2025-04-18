"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const CheckoutPage = () => {
    const router = useRouter()
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const quantity = searchParams.get("quantity") || "1";
  const eventId = searchParams.get("eventId") || "";
  const ticketPrice = searchParams.get("totalAmount") || "";

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [error, setError] = useState<string>("");

  const validateCardNumber = (card: string) => {
    const regex = /^[0-9]{16}$/;
    return regex.test(card);
  };

  const validateExpiry = (expiry: string) => {
    
    const [month, year] = expiry.split("/").map((part) => part.trim());
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
  
    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12 || year.length !== 2) return false;
  
    const currentYear = new Date().getFullYear().toString().slice(2);
    
    return yearNum > parseInt(currentYear) || (yearNum === parseInt(currentYear) && monthNum >= new Date().getMonth() + 1);
  };

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3}$/.test(cvv);
  };
  

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");

    if (!cardNumber || !cvv || !expiry) {
      setError("All fields are required.");
      return;
    }

    if (!validateCardNumber(cardNumber)) {
      setError("Invalid card number.");
      return;
    }

    if (!validateExpiry(expiry)) {
      setError("Invalid expiry date.");
      return;
    }

    if (!validateCVV(cvv)) {
      setError("Invalid CVV.");
      return;
    }
    
    const response = await fetch("http://localhost:8000/api/event/booking/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        quantity,
        event: eventId,
      }),
    });

    if (response.ok) {
        toast.success("🎉 Tickets booked successfully!");
        router.push('success-booking')
    } else {
        toast.error("❌ Something went wrong while booking.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-sm space-y-6">
      <h2 className="text-2xl font-bold items-center justify-center w-full flex">Checkout</h2>
      <div className="space-y-1 text-gray-700">
        <p>
          <strong>Event ID:</strong> {eventId}
        </p>
        <p>
          <strong>Ticket Number:</strong> {quantity}
        </p>
        <p>
          <strong>Total Price:</strong> ₹ {ticketPrice}
        </p>
      </div>
      {error && <div className="text-red-500">{error}</div>} {/* Error message display */}
      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block">Card Number</label>
          <input
            required
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="1234 5678 9012 3456"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block">Expiry</label>
            <input
              required
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="MM/YY"
            />
          </div>
          <div className="flex-1">
            <label className="block">CVV</label>
            <input
              required
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="123"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#004aad] text-white py-2 px-4 rounded-md hover:bg-[#003080] transition cursor-pointer"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
