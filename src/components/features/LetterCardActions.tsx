"use client";

import { Trash2, Pencil, X, AlertTriangle } from "lucide-react";
import { deleteLetter, updateLetter } from "@/lib/actions/mailbox";
import { useState } from "react";

// 1. FIXED: Swapped open_date for deliver_at
interface Letter {
  id: string;
  title: string;
  content: string;
  deliver_at: string;
}

interface LetterCardActionsProps {
  letter: Letter;
}

export default function LetterCardActions({ letter }: LetterCardActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // 2. FIXED: Grabbing the date from deliver_at safely
  const formattedDate = letter.deliver_at
    ? letter.deliver_at.split("T")[0]
    : "";

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await deleteLetter(letter.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete letter:", error);
      alert("Failed to delete letter. Check console.");
    }
    setIsPending(false);
  };

  const handleUpdate = async (formData: FormData) => {
    setIsPending(true);
    try {
      await updateLetter(formData);
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update letter:", error);
      alert("Failed to save changes. Check console.");
    }
    setIsPending(false);
  };

  return (
    <>
      {/* Trigger Buttons */}
      <div
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-background/90 backdrop-blur-sm p-1.5 border border-border z-10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <button
          title="Edit Letter"
          type="button"
          className="p-1.5 text-foreground/60 hover:text-primary transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowEditModal(true);
          }}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          title="Delete Letter"
          type="button"
          className="p-1.5 text-foreground/60 hover:text-red-500 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#FFFDF9] border border-border p-8 shadow-2xl max-w-sm w-full text-center">
            <AlertTriangle className="w-12 h-12 text-red-500/80 mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-foreground mb-2">
              Burn Letter?
            </h2>
            <p className="text-foreground/60 font-serif text-sm mb-8">
              This will permanently delete "{letter.title}". This cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isPending}
                className="flex-1 py-3 border border-border text-foreground hover:bg-secondary/20 transition-colors font-serif uppercase tracking-widest text-[10px]"
              >
                Keep It
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-3 bg-red-500/10 border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors font-serif uppercase tracking-widest text-[10px] disabled:opacity-50"
              >
                {isPending ? "Burning..." : "Burn It"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            action={handleUpdate}
            className="bg-[#FFFDF9] border border-border p-8 md:p-12 shadow-2xl max-w-md w-full relative text-left"
          >
            <input type="hidden" name="id" value={letter.id} />

            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="absolute top-6 right-6 text-foreground/50 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-3xl text-foreground mb-8">
              Edit Letter
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
                  Subject / Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={letter.title}
                  required
                  className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* 3. FIXED: Name is deliver_at and it grabs the correct formattedDate */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
                  Date to Open
                </label>
                <input
                  type="date"
                  name="deliver_at"
                  defaultValue={formattedDate}
                  required
                  className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
                  Message
                </label>
                <textarea
                  name="content"
                  defaultValue={letter.content}
                  required
                  rows={5}
                  className="w-full bg-transparent border border-border/50 p-3 font-serif text-base text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 mt-4 bg-background border border-primary text-primary hover:bg-primary hover:text-background transition-colors font-serif uppercase tracking-[0.2em] text-xs disabled:opacity-50"
              >
                {isPending ? "Sealing..." : "Seal Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
