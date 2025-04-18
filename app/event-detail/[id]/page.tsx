"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EventType } from "@/types";
import Image from "next/image";
import BookTicketModal from "@/component/BookTicketModal";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventType | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/event/events/${id}/`
        );
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (!event) {
    return (
      <p className="text-center text-gray-500">Loading event details...</p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex flex-col items-start gap-6">
        <div className="w-full">
          <Image
            src={event.image}
            alt={event.title}
            width={600}
            height={400}
            className="w-full h-auto rounded-xl shadow-xl object-cover"
          />
        </div>

        <div className="w-full space-y-6">
          <h1 className="text-4xl font-extrabold text-[#004aad]">
            {event.title}
          </h1>

          <div className="flex flex-col-reverse md:flex-row items-start justify-between border-t w-full">
            <div className="pt-4 space-y-2">
              <p className="text-lg">
                <span className="font-semibold text-gray-800">Category:</span>{" "}
                {event.event_category}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-800">Date:</span>{" "}
                {event.date}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-800">City:</span>{" "}
                {event.city}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-800">
                  Organized By:
                </span>{" "}
                {event.created_by}
              </p>
            </div>

            <div className="mt-6 flex flex-col">
              <span className="px-5 items-center flex justify-center py-2 rounded-full text-lg font-semibold shadow-md">
                ${event.price}
              </span>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="mt-4 bg-[#004aad] text-white px-6 py-2 rounded-md hover:bg-[#003080] transition cursor-pointer uppercase"
              >
                Book Now
              </button>
              <BookTicketModal
                open={isBookingOpen}
                onOpenChange={setIsBookingOpen}
                eventTitle={event.title}
                eventId={event.id}
                eventPrice={event.price}
              />
            </div>
          </div>

          <p className="text-gray-600 text-base leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
