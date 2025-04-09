"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EventType } from "@/types"; 
import Image from "next/image"

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventType | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/event/events/${id}/`);
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (!event) {
    return <p className="text-center text-gray-500">Loading event details...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-20">
        <div className="md:w-2/5">
          <Image
            src={event.image}
            alt={event.title}
            width={400}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-gray-600 text-lg mt-2">{event.description}</p>

          <div className="mt-4">
            <p className="text-gray-700">
              <strong>Category:</strong> {event.event_category}
            </p>
            <p className="text-gray-700">
              <strong>Date:</strong> {event.date}
            </p>
            <p className="text-gray-700">
              <strong>City:</strong> {event.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
