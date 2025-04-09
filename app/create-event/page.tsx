"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useState } from "react";
import WithAuth from "@/component/utils/WithAuth";

interface EventFormInputs {
  title: string;
  description: string;
  city: string;
  category: string;
  date: string;
  image: FileList;
}

const cities = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Adelaide",
  "Perth",
  "Hobart",
  "Darwin",
  "Canberra",
];

const categories = [
  "Music",
  "Nightlife",
  "Performing & Visual Arts",
  "Holidays",
  "Dating",
  "Hobbies",
  "Business",
  "Food & Drink",
];

const CreateEventPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormInputs>();

  const onSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("city", data.city);
    formData.append("event_category", data.category);
    formData.append("date", data.date);
    if (data.image[0]) formData.append("image", data.image[0]);
  
    try {
      const token = localStorage.getItem("accessToken");
  
      const response = await fetch("http://127.0.0.1:8000/api/event/events", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData?.detail || "Failed to create event");
      }
  
      toast.success("Event created successfully!");
      reset();
      router.push("/user-profile");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Event creation failed");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white border border-[#81a7e3] rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-[#004aad] uppercase">
          Create Event
        </h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Event Title"
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <textarea
            placeholder="Description"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full px-4 py-2 border rounded-md"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <select
            {...register("city", { required: "City is required" })}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}

          <select
            {...register("category", { required: "Category is required" })}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}

          <input
            type="datetime-local"
            {...register("date", { required: "Date is required" })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}

          <input
            type="file"
            {...register("image")}
            className="w-full px-4 py-2 border rounded-md"
          />

          <div className="flex justify-between">
            <motion.button
              type="submit"
              className="px-6 py-2 text-white bg-[#004aad] rounded-md"
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Create Event"}
            </motion.button>

            <Link
              href="/profile"
              className="px-6 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithAuth(CreateEventPage);
