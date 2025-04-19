"use client";

import Image from "next/image";
import { EventType } from "@/types";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";

interface EventCardProps {
  event: EventType;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const backendUrl = "http://localhost:8000";

  const imageUrl =
    event.image &&
    typeof event.image === "string" &&
    event.image.startsWith("/media")
      ? `${backendUrl}${event.image}`
      : event.image || "/images/default-event.jpg";
  const [userName, setUserName] = useState<string>("");

  const [likes, setLikes] = useState<number>(event.likes || 0);
  const [liked, setLiked] = useState<boolean>(event.liked || false);

  const [isDeleting, setIsDeleting] = useState(false);
  const user = localStorage.getItem("user");
  
  useEffect(() => {
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser.first_name) {
          setUserName(parsedUser.first_name);
        }
        if (event.liked && Array.isArray(event.liked)) {
          setLiked(event.liked.includes(parsedUser.id));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
    if (event.likes !== undefined) {
      setLikes(event.likes);
    }
  }, [user, event]);

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("No access token found. Please log in.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/event/events/${eventId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }

      toast.success("Event deleted successfully.");
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error deleting event.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const [liking, setLiking] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (liking) return;
    setLiking(true);
    try {
      if (accessToken) {
        const headers: Record<string, string> = {};

        if (accessToken) {
          headers["Authorization"] = `JWT ${accessToken}`;
        }

        const res = await fetch(
          `http://127.0.0.1:8000/api/event/events/${event.id}/like/`,
          {
            method: "POST",
            headers
          },
        );
  
        if (res.ok) {
          const data = await res.json();
          setLikes(data.likes);
          setLiked(data.liked);
        }
      } else {
        toast.info('Please login to like this event')
      }
    } catch (err) {
      console.error("Failed to like event", err);
    } finally {
      setLiking(false);
    }
  };

  return (
    <Link href={`/event-detail/${event.id}`} className="block">
      <div className="border rounded-2xl shadow-sm border-[#81a7e3] overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer bg-white relative">
        <div className="relative w-full h-56">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold text-[#004aad] truncate">
            {event.title}
          </h3>
          <p className="text-gray-500 text-sm">
            {event.city} • {format(new Date(event.date), "PPP p")}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="text-left">
              <p className="text-sm text-gray-700">{event.event_category}</p>
              <p className="text-xs text-gray-600">{event.event_mode}</p>
              <p className="text-xs text-gray-500">By {event.created_by}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#004aad]">
                $ {event.price}
              </p>
              {userName && event.created_by === userName && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteEvent(event.id);
                  }}
                  className="absolute top-3 right-3 text-white hover:text-gray-300 cursor-pointer"
                  disabled={isDeleting}
                  title="Delete Event"
                >
                  <FaTrash size={20} />
                </button>
              )}
              <button
                onClick={handleLike}
                className="text-[#004aad] hover:text-red-400 cursor-pointer mt-1 flex items-center"
                title="Like Event"
              >
                {liked ? (
                  <FaHeart size={18} color="red" />
                ) : (
                  <FaRegHeart size={18} />
                )}
                <span className="ml-1 text-sm text-[#004aad]">{likes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
