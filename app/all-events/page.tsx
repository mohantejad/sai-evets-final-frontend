"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EventType } from "@/types";
import EventCard from "@/component/utils/EventCard";

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

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllEventsContent />
    </Suspense>
  );
};

const AllEventsContent = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<EventType[]>([]);
  const categoryFromUrl = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedDate, setSelectedDate] = useState("");
  const city = searchParams.get("city") || "";
  const searchKeyword = searchParams.get("search") || "";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let apiUrl = `http://127.0.0.1:8000/api/event/events/?`;
        if (city) apiUrl += `city=${encodeURIComponent(city)}&`;
        if (searchKeyword)
          apiUrl += `search=${encodeURIComponent(searchKeyword)}&`;
        if (selectedCategory)
          apiUrl += `event_category=${encodeURIComponent(selectedCategory)}&`;
        if (selectedDate) apiUrl += `date=${encodeURIComponent(selectedDate)}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [city, searchKeyword, selectedCategory, selectedDate]);

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedDate("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-2">Events in {city || "Australia"}</h2>
      <p className="text-gray-500 mb-6">
        Search for something you love or check out popular events in your area.
      </p>

      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-full md:w-1/4 flex flex-col md:block">
          <h3 className="font-bold text-xl mb-4 uppercase">Filters</h3>

          <div className="mb-4 w-full md:hidden">
            <label className="block font-semibold text-lg">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 w-full md:hidden">
            <label className="block font-semibold text-lg">Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Any Date</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this_weekend">This Weekend</option>
            </select>
          </div>

          <div className="hidden md:block">
            <h4 className="font-semibold mb-2 text-lg">Category</h4>
            {categories.map((category) => (
              <p
                key={category}
                className={`cursor-pointer py-1 ${
                  selectedCategory === category
                    ? "text-blue-600 font-bold"
                    : "text-gray-600"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </p>
            ))}
          </div>

          <div className="hidden md:block">
            <h4 className="font-semibold mb-2 text-lg">Date</h4>
            {["Today", "Tomorrow", "This Weekend"].map((date) => (
              <p
                key={date}
                className={`cursor-pointer py-1 ${
                  selectedDate === date.toLowerCase()
                    ? "text-blue-600 font-bold"
                    : "text-gray-600"
                }`}
                onClick={() => setSelectedDate(date.toLowerCase())}
              >
                {date}
              </p>
            ))}
          </div>

          <button
            className="p-2 bg-gray-300 text-black rounded-md w-full"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p className="text-gray-500">No events found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
