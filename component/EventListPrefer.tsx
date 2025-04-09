"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import EventCard from "./utils/EventCard";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { EventType } from "@/types";

const eventFilters = [
  "All",
  "For you",
  "Online",
  "Today",
  "This weekend",
  "Women's History Month",
  "Free",
  "Music",
  "Food & Drink",
  "Charity & Causes",
];

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

type FormValues = {
  location: string;
};

const EventListPrefer = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [city, setCity] = useState("Sydney");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredCities, setFilteredCities] = useState<string[]>(cities);
  const visibleCount = 10;

  const {
    control,
    setValue,
    watch,
    formState: { },
  } = useForm<FormValues>({
    defaultValues: { location: "" },
  });

  const handleCityInput = (value: string) => {
    setValue("location", value);
    setFilteredCities(
      value
        ? cities.filter((city) =>
            city.toLowerCase().startsWith(value.toLowerCase())
          )
        : cities
    );
  };

  const handleCitySelect = (city: string) => {
    setValue("location", city);
    setCity(city);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      console.log(city)
      try {
        const response = await fetch(
          `http://localhost:8000/api/event/events/?city=${encodeURIComponent(
            city
          )}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          setEvents(await response.json());
        } else {
          setEvents([]);
        }
      } catch (error) {
        setEvents([]);
        console.log(error)
      }
    };
    fetchEvents();
  }, [city]);



  const isToday = (eventDate: string) => {
    const today = new Date().toISOString().split("T")[0];
    return eventDate === today;
  };

  const isThisWeekend = (eventDate: string) => {
    const eventDay = new Date(eventDate).getDay();
    return eventDay === 5 || eventDay === 6;
  };

  const filteredEvents = events.filter((event) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Today") return isToday(event.date);
    if (selectedFilter === "This weekend") return isThisWeekend(event.date);

    return event.event_category?.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="relative w-full py-4 px-12">
      <div className="flex space-x-4 flex-col md:flex-row mb-4">
        <h2 className="text-xl font-bold">Browsing events in</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCity(watch("location"));
          }}
          className="flex items-center border-b border-[#004aad] "
        >
          <IoIosArrowDown size={28} />

          <div className="relative flex items-center px-4 w-full">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <div className="w-full">
                  <input
                    {...field}
                    type="text"
                    placeholder={`${city}`}
                    className="bg-transparent outline-none w-full text-[#004aad]/90"
                    onChange={(e) => handleCityInput(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setIsDropdownOpen(false), 200)
                    }
                    autoComplete="off"
                  />
                </div>
              )}
            />

            {isDropdownOpen && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10 h-48 overflow-y-scroll">
                {filteredCities.length === 0 &&
                  watch("location") === "" &&
                  cities.map((city, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </li>
                  ))}

                {filteredCities.length > 0 ? (
                  filteredCities.map((city, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No cities found</li>
                )}
              </ul>
            )}
          </div>
        </form>
      </div>

      <motion.div
        ref={containerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide p-2"
        whileTap={{ cursor: "grabbing" }}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {eventFilters.map((filter, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors duration-300 ${
              selectedFilter === filter
                ? "bg-[#004aad] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </div>
        ))}
      </motion.div>
      <div className="py-4">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredEvents.slice(0, visibleCount).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No events found.</p>
        )}
      </div>

      <div className="flex justify-center mt-6 pb-8">
        <motion.button
          onClick={() =>
            router.push(`/all-events?city=${encodeURIComponent(city)}`)
          }
          className="px-6 py-2 bg-white text-[#004aad] border border-[#004aad] font-extrabold uppercase tracking-widest rounded-md cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          SEE MORE EVENTS
        </motion.button>
      </div>
    </div>
  );
};

export default EventListPrefer;
