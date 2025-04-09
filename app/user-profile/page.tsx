"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UserType, EventType } from "@/types";
import { RootState } from "@/redux/store";
import EventCard from "@/component/utils/EventCard";



const UserDetails = () => {
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [userDetails, setUserDetails] = useState<UserType>();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserType>({
    id: 0,
    username: "",
    email: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch("http://localhost:8000/auth/users/me/", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const { user, events } = await response.json();
        setUserDetails(user);
        setEvents(events);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error?.message || "Error fetching profile");
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user, router]);

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
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username: updatedUser.username || userDetails?.username,
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
                  Username
                </label>
                <input
                  type="text"
                  className="border p-2 rounded w-full mb-2"
                  value={updatedUser.username}
                  placeholder={userDetails?.username}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, username: e.target.value })
                  }
                />

                <label className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="border p-2 rounded w-full mb-2"
                  value={updatedUser.email}
                  placeholder={userDetails?.email} // Placeholder with current email
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
                  <strong>Username:</strong> {userDetails?.username}
                </p>
                <p>
                  <strong>Email:</strong> {userDetails?.email}
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
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
        {events.length === 0 ? (
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
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
        onClick={() => router.push("/create-event")}
      >
        Create New Event
      </button>
    </div>
  );
};

export default UserDetails;
