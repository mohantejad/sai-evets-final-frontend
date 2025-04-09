import Image from "next/image"
import { EventType } from "@/types";
import Link from "next/link";
import { format } from "date-fns";


interface EventCardProps {
  event: EventType;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {

  const backendUrl = "http://localhost:8000";
  const imageUrl = event.image.startsWith("/media")
  ? `${backendUrl}${event.image}`
  : event.image;

  console.log(imageUrl)
  return (
    <Link href={`/event-detail/${event.id}`} className="block">
      <div className="border rounded-lg shadow-md border-[#81a7e3] overflow-hidden transition-transform transform hover:scale-105 cursor-pointer bg-white">
        <div className="relative w-full h-52">
          <Image
            src={imageUrl || "/images/default-event.jpg"}
            alt={event.title}
            width={500}
            height={500}
            className="rounded-t-lg"
            priority
            unoptimized
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-[#004aad]">{event.title}</h3>
          <p className="text-gray-500 text-sm mt-1">
            {event.city} • {format(new Date(event.date), "PPP p")}
          </p>
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
            {event.event_category}
          </p>
          <p className="text-xs text-gray-500 mt-3">By {event.created_by}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;


