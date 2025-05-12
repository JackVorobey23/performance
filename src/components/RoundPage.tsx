import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Timer from "@/components/Timer";
import gif from "@/assets/gifs/video.gif";
import { X } from "lucide-react";
import { LocalStoreService } from "@/lib/LocalstoreService";

interface Participant {
  id: number;
  image: string;
  name: string;
}

export interface RoundConfig {
  requiredSelections: number;
  participants: Participant[];
  id: number;
}

interface RoundPageProps {
  round: RoundConfig;
  onReturnToMenu: () => void;
}

export default function RoundPage({ round, onReturnToMenu }: RoundPageProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    []
  );

  const [showResult, setShowResult] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  const toggleParticipant = (id: number) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter((p) => p !== id));
    } else if (selectedParticipants.length < round.requiredSelections) {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  const handleConfirm = () => {
    LocalStoreService.setImages(
      `round-${round.id}`,
      round.participants
        .filter((p) => selectedParticipants.includes(p.id))
        .map((p) => p.image)
    );
    setShowResult(true);
  };

  const handleTimeExpired = () => {
    setTimeExpired(true);
    // Auto-confirm when time expires
    if (selectedParticipants.length === round.requiredSelections) {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-4xl">
        <div className="mb-8 w-full max-w-md">
          <img
            src={gif}
            alt="Result GIF"
            width={400}
            height={300}
            className="mx-auto rounded-lg"
          />
        </div>
        <Button
          onClick={onReturnToMenu}
          className="mt-8 bg-blue-600 hover:bg-blue-500 text-xl py-6 px-8"
        >
          На головну
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 items-center justify-center w-full max-w-4xl">
      <h1 className="text-3xl font-bold">Обрати учасників</h1>

      <div className="mb-6">
        <Timer duration={60} onExpire={handleTimeExpired} />
      </div>

      <div className="flex gap-12 flex-wrap justify-center items-center">
        {round.participants.map((participant) => (
          <div
            key={participant.id}
            className="relative flex justify-center gap-4"
          >
            <button
              onClick={() => toggleParticipant(participant.id)}
              disabled={timeExpired}
              className={`
                transform -rotate-45 aspect-square relative overflow-hidden h-20 w-20 border-2 border-blue-400
                ${
                  selectedParticipants.includes(participant.id)
                    ? "grayscale"
                    : "shadow-lg shadow-green-400/30"
                }
                ${
                  timeExpired
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }
                transition-all duration-200
              `}
            >
              <div className="absolute inset-0 transform flex items-center justify-center overflow-hidden">
                <img
                  src={participant.image || "/placeholder.svg"}
                  alt={participant.name}
                  className="min-w-full min-h-full object-cover"
                />
              </div>
            </button>

            {selectedParticipants.includes(participant.id) && (
              <button
                onClick={() => toggleParticipant(participant.id)}
                disabled={timeExpired}
                className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1 transform -rotate-90 z-10"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="text-xl">
        {selectedParticipants.length}/{round.requiredSelections} обрано
      </div>

      <Button
        onClick={handleConfirm}
        disabled={
          selectedParticipants.length !== round.requiredSelections ||
          timeExpired
        }
        className={`
          bg-blue-600 hover:bg-blue-500 text-xl py-4 px-8
          ${
            selectedParticipants.length !== round.requiredSelections ||
            timeExpired
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        `}
      >
        Продовжити
      </Button>
    </div>
  );
}
