import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { AI_PROMT, SelecetBudgetOptions, SelectTravelsList } from "@/constants/Options";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";
import useGoogleAuth from "@/service/useGoogleAuth";

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, isLoading: authLoading, signIn } = useGoogleAuth();
  const navigate = useNavigate();

  const handleSubmit = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    // console.log("formData:", formData);
  }, [formData]);

  const completedCount = useMemo(() => {
    let c = 0;
    if (formData?.location) c++;
    if (formData?.noOfDays) c++;
    if (formData?.budget) c++;
    if (formData?.traveler) c++;
    return c;
  }, [formData]);

  const percent = useMemo(() => Math.round((completedCount / 4) * 100), [completedCount]);

  const OnGenerateTrip = async () => {
    const savedUser = user || JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      setOpenDialog(true);
      return;
    }

    const days = Number(formData?.noOfDays);
    if (
      Number.isNaN(days) ||
      days <= 0 ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill the form properly...");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMT
      .replace("{location}", formData?.location || "a destination")
      .replaceAll("{totalDays}", String(days))
      .replace("{traveler}", formData?.traveler || "solo traveler")
      .replace("{budget}", formData?.budget || "moderate");

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const maybeText = result?.response?.text?.();
      const aiText =
        typeof maybeText?.then === "function" ? await maybeText : maybeText;

      await SaveAiTrip(aiText);
    } catch (err) {
      console.error("Generation error:", err);
      toast("Something went wrong while generating the trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    try {
      const currentUser = user || JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();

      const cleaned = String(TripData || "")
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.error("Invalid JSON from AI:", cleaned);
        toast("AI response was not valid JSON. Please try again.");
        throw e;
      }

      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: parsed,
        userEmail: currentUser?.email,
        id: docId,
      });

      navigate("/view-trip/" + docId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Top header */}
      <div className="border-b border-gray-200/70 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Customize your Trip
              </h1>
              <p className="text-sm text-gray-600">
                Tell your preferences and let the AI do the rest.
              </p>
            </div>

            {/* Progress */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="relative">
                <svg viewBox="0 0 36 36" className="w-10 h-10">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
                  />
                  <path
                    className="text-emerald-500 transition-all"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
                    style={{
                      strokeDasharray: 100,
                      strokeDashoffset: 100 - percent,
                    }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                  {percent}%
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {completedCount}/4 complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Left: form card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8 space-y-10">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Where is your destination?
                </label>
                <div className="mt-2">
                  <Input
                    className="mt-0"
                    placeholder="e.g., Paris, France"
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => handleSubmit("location", e.target.value)}
                    onBlur={(e) => handleSubmit("location", e.target.value.trim())}
                  />
                </div>
                {formData?.location ? (
                  <p className="text-xs text-emerald-700 mt-2">
                    ✓ Destination: <span className="font-medium">{formData.location}</span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">
                    Tip: include city and country for best results.
                  </p>
                )}

                {/* quick picks (non-functional hints; clicking still just fills via handler) */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Bali, Indonesia", "Paris, France", "Kyoto, Japan", "Reykjavík, Iceland"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSubmit("location", s)}
                      className="text-xs rounded-full border border-gray-600 px-3 py-1.5 bg-white hover:bg-gray-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days */}
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  How many days do you want to travel?
                </label>
                <div className="mt-2 max-w-xs">
                  <Input
                    placeholder="Ex. 3"
                    type="number"
                    min={1}
                    value={formData.noOfDays || ""}
                    onChange={(e) => handleSubmit("noOfDays", e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We’ll build a day-by-day plan around this.
                </p>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  What is your budget?
                </label>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {SelecetBudgetOptions.map((item, index) => {
                    const selected = formData?.budget === item.title;
                    return (
                      <button
                        key={index}
                        type="button"
                        className={[
                          "text-left p-4 rounded-xl border transition-all",
                          "hover:shadow-md hover:-translate-y-0.5",
                          selected
                            ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                            : "border-gray-200 bg-white"
                        ].join(" ")}
                        onClick={() => handleSubmit("budget", item.title)}
                      >
                        <div className="text-4xl">{item.icon}</div>
                        <div className="mt-2 font-semibold">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Traveler */}
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Whom are you planning to travel with?
                </label>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {SelectTravelsList.map((item, index) => {
                    const selected = formData?.traveler === item.title;
                    return (
                      <button
                        key={index}
                        type="button"
                        className={[
                          "text-left p-4 rounded-xl border transition-all",
                          "hover:shadow-md hover:-translate-y-0.5",
                          selected
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 bg-white"
                        ].join(" ")}
                        onClick={() => handleSubmit("traveler", item.title)}
                      >
                        <div className="text-4xl">{item.icon}</div>
                        <div className="mt-2 font-semibold">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex items-center justify-end">
                <Button
                  className="px-6 py-5 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                  onClick={OnGenerateTrip}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Generating…
                    </span>
                  ) : (
                    "Generate Trip"
                  )}
                </Button>
              </div>
            </div>

            {/* Footer note inside card */}
            <div className="px-6 sm:px-8 py-4 border-t bg-gray-50 text-xs text-gray-500">
              Your preferences are only used to create this itinerary. You can edit everything later.
            </div>
          </div>

          {/* Right: sticky summary */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-gradient-to-r from-white to-emerald-50">
                  <div className="text-sm font-semibold text-gray-900">Trip Summary</div>
                  <div className="mt-1 text-xs text-gray-600">
                    A quick preview of your selections
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <SummaryRow label="Destination" value={formData?.location || "—"} />
                  <SummaryRow label="Days" value={formData?.noOfDays || "—"} />
                  <SummaryRow label="Budget" value={formData?.budget || "—"} />
                  <SummaryRow label="Travelers" value={formData?.traveler || "—"} />

                  <div className="mt-3 rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-600">
                    Pro tip: more specific destinations (area, neighborhood) help us optimize travel time.
                  </div>
                </div>
                <div className="px-5 py-4 border-t bg-white">
                  <Button
                    className="w-full rounded-xl bg-gray-900 hover:bg-black text-white"
                    disabled={loading}
                    onClick={OnGenerateTrip}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <AiOutlineLoading3Quarters className="animate-spin" />
                        Generating…
                      </span>
                    ) : (
                      "Generate Trip"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sign-in Dialog (unchanged behavior) */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>Use your Google account to continue.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={async () => {
                try {
                  await signIn();
                  setOpenDialog(false);
                  OnGenerateTrip();
                } catch (e) {
                  // handled in hook
                }
              }}
              disabled={authLoading}
            >
              {authLoading ? "Signing in..." : "Sign In"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryRow({ label, value }) {
  const isEmpty = !value || value === "—";
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-sm font-medium ${isEmpty ? "text-gray-400" : "text-gray-900"}`}>
        {String(value)}
      </div>
    </div>
  );
}

export default CreateTrip;
