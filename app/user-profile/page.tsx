"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UserType, EventType } from "@/types";
import EventCard from "@/component/utils/EventCard";
import { store } from "@/redux/store";
import { loginSuccess } from "@/redux/authSlice";

const UserDetails = () => {
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('')

  const [userDetails, setUserDetails] = useState<UserType>();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserType>({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const userresponse = await fetch(
          "http://localhost:8000/auth/users/me/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${accessToken}`,
            },
          }
        );

        if (!userresponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        if (userresponse.ok) {
          const userData = await userresponse.json();
          setUserDetails(userData);
          store.dispatch(loginSuccess({ user: userData }));
        }

      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Error fetching profile");
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }

      try {
        const eventResponse = await fetch(
          "http://localhost:8000/api/event/events/my_events/",
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${accessToken}`,
            },
          }
        );

        if (!eventResponse.ok) {
          throw new Error("Failed to fetch user events");
        }

        const eventData = await eventResponse.json();
        setEvents(eventData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Error fetching User events");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleUpdateProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch("http://localhost:8000/auth/users/me/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${accessToken}`,
        },
        body: JSON.stringify({
          first_name: updatedUser.first_name || userDetails?.first_name,
          last_name: updatedUser.last_name || userDetails?.last_name,
          email: updatedUser.email || userDetails?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setUserDetails(updatedData);

      toast.success("Profile updated successfully! 🎉");
      setEditMode(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Error updating profile");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (loading)
    return <p className="text-center text-[#004aad]">Loading profile...</p>;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white border border-[#81a7e3] rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-[#004aad] uppercase">
          User Profile
        </h2>
        <div className="mt-4 space-y-2">
          <div>
            {editMode ? (
              <div>
                <label className="block font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  className="border p-2 rounded w-full mb-2"
                  value={updatedUser.first_name}
                  placeholder={userDetails?.first_name}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      first_name: e.target.value,
                    })
                  }
                />

                <label className="block font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  className="border p-2 rounded w-full mb-2"
                  value={updatedUser.last_name}
                  placeholder={userDetails?.last_name}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      last_name: e.target.value,
                    })
                  }
                />

                <label className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="border p-2 rounded w-full mb-2"
                  value={updatedUser.email}
                  placeholder={userDetails?.email}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, email: e.target.value })
                  }
                />

                <div className="flex items-center justify-between">
                  <button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </button>

                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>
                  <strong>First Name:</strong> {userDetails?.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {userDetails?.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {userDetails?.email}
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-[#004aad]">Your Events</h3>
        {!events || events.length === 0 ? (
          <p className="mt-4 text-gray-500">
            You have not created any events yet.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <button
        className="mt-8 px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
        onClick={() => router.push("/create-event")}
      >
        Create New Event
      </button>
    </div>
  );
};

export default UserDetails;
