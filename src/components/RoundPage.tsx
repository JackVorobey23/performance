import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Timer from "@/components/Timer";
import gif from "@/assets/gifs/video.gif";
import { X } from "lucide-react";
import { LocalStoreService } from "@/lib/LocalstoreService";
import { cn } from "@/lib/utils";

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
const smallDevice = window.innerWidth < 400;

const getChunkedParticipants = (participants: Participant[]) => {
  const chunkedParticipants = [];
  let flag = true;

  try {
    for (let i = 0; i < participants.length; i++) {
      if (smallDevice) {
        if (flag) {
          chunkedParticipants.push([participants[i], participants[i + 1]]);
          i++;
        } else {
          chunkedParticipants.push([participants[i]]);
        }
      } else {
        if (flag) {
          chunkedParticipants.push([
            participants[i],
            participants[i + 1],
            participants[i + 2],
          ]);
          i += 2;
        } else {
          chunkedParticipants.push([participants[i], participants[i + 1]]);
          i++;
        }
      }
      flag = !flag;
    }
  } catch (e) {
    console.log("first", e);
  }

  return chunkedParticipants;
};

export default function RoundPage({ round, onReturnToMenu }: RoundPageProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    []
  );
  const chunkedParticipants = getChunkedParticipants(round.participants);

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

  const getImage = (p: Participant) => {
    return p ? (
      <div>
        {selectedParticipants.includes(p.id) && (
          <button
            onClick={() => toggleParticipant(p.id)}
            disabled={timeExpired}
            className="bg-red-500 absolute rounded-full p-1 transform z-10 border-0 rotate-45 ml-[1dvw] mt-[1dvw]"
          >
            <X size={16} />
          </button>
        )}
        <img
          onClick={() => toggleParticipant(p.id)}
          key={p.id}
          src={p.image}
          alt={p.name}
          className={`transition-all duration-200 border-1 border-blue-400 ${
            selectedParticipants.includes(p.id)
              ? "grayscale"
              : "shadow-lg shadow-green-400/30"
          }`}
        />
      </div>
    ) : (
      <div className=""></div>
    );
  };
  const handleTimeExpired = () => {
    setTimeExpired(true);
    setShowResult(true);
    LocalStoreService.setImages(`round-${round.id}`, ["time", "expired"]);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-4xl">
        <div className="mb-8 w-full max-w-md">
          {timeExpired ? (
            <span className="text-2xl font-bold text-center">
              Час закінчився!
            </span>
          ) : (
            <img
              src={gif}
              alt="Result GIF"
              width={400}
              height={300}
              className="mx-auto rounded-lg"
            />
          )}
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
    <div className="flex flex-col gap-10 items-center justify-center w-full">
      <h1 className="text-3xl font-bold">Оберіть учасників</h1>

      <div className="mb-6">
        <Timer duration={60} onExpire={handleTimeExpired} />
      </div>
      <div className="flex flex-col justify-around">
        {chunkedParticipants.map((chunk, index) =>
          smallDevice ? (
            <div
              className={cn(
                "flex w-full items-center justify-center",
                index !== 0 ? "-mt-[18dvw]" : ""
              )}
            >
              <div className="">
                <div
                  className={cn(
                    "flex flex-wrap gap-[4dvw] *:h-[42dvw] *:w-[42dvw] *:scale-[70%] *:rotate-45"
                  )}
                >
                  {chunk.map((p) => getImage(p))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "flex w-full items-center justify-center",
                index !== 0 ? "-mt-[12dvw]" : ""
              )}
            >
              <div className="">
                <div
                  className={cn(
                    "flex flex-wrap gap-[4dvw] *:h-[30dvw] *:w-[30dvw] *:scale-[70%] *:rotate-45",
                    index % 2 !== 0 ? "-mt-[1dvw]" : ""
                  )}
                >
                  {chunk.map((p) => getImage(p))}
                </div>
              </div>
            </div>
          )
        )}
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
