"use client";

import { Trash2, Pencil, X, AlertTriangle } from "lucide-react";
import { deleteEvent, updateEvent } from "@/lib/actions/events";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  event_date: string;
  location?: string;
  description?: string;
}

interface EventCardActionsProps {
  event: Event;
}

export default function EventCardActions({ event }: EventCardActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const formattedDate = event.event_date.split("T")[0];

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await deleteEvent(event.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Check console for details.");
    }
    setIsPending(false);
  };

  // Next.js 15 native action handler
  const handleUpdate = async (formData: FormData) => {
    setIsPending(true);
    try {
      await updateEvent(formData);
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update event:", error);
      alert("Failed to save changes. Check console for details.");
    }
    setIsPending(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Trigger Buttons */}
      <div
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-background/90 backdrop-blur-sm p-1.5 border border-border z-10"
        onClick={stopPropagation}
      >
        <button
          title="Edit Event"
          className="p-1.5 text-foreground/60 hover:text-primary transition-colors"
          onClick={() => setShowEditModal(true)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          title="Delete Event"
          className="p-1.5 text-foreground/60 hover:text-red-500 transition-colors"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 cursor-default"
          onClick={stopPropagation}
        >
          <div className="bg-[#FFFDF9] border border-border p-8 shadow-2xl max-w-sm w-full text-center">
            <AlertTriangle className="w-12 h-12 text-red-500/80 mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-foreground mb-2">
              Delete Event?
            </h2>
            <p className="text-foreground/60 font-serif text-sm mb-8">
              This will permanently remove "{event.title}" from your itinerary.
              This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isPending}
                className="flex-1 py-3 border border-border text-foreground hover:bg-secondary/20 transition-colors font-serif uppercase tracking-widest text-[10px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-3 bg-red-500/10 border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors font-serif uppercase tracking-widest text-[10px] disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 cursor-default"
          onClick={stopPropagation}
        >
          <form
            action={handleUpdate}
            className="bg-[#FFFDF9] border border-border p-8 md:p-12 shadow-2xl max-w-md w-full relative text-left"
          >
            {/* Hidden ID input so the server knows which row to update */}
            <input type="hidden" name="id" value={event.id} />

            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="absolute top-6 right-6 text-foreground/50 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-3xl text-foreground mb-8">
              Edit Event
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={event.title}
                  required
                  className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="event_date"
                  defaultValue={formattedDate}
                  required
                  className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={event.location || ""}
                  className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
                  Description / Notes
                </label>
                <textarea
                  name="description"
                  defaultValue={event.description || ""}
                  rows={3}
                  className="w-full bg-transparent border border-border/50 p-3 font-serif text-base text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 mt-4 bg-background border border-primary text-primary hover:bg-primary hover:text-background transition-colors font-serif uppercase tracking-[0.2em] text-xs disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
