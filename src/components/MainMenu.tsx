import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import RoundPage, { type RoundConfig } from "@/components/RoundPage";
import { LocalStoreService } from "@/lib/LocalstoreService";
import Header from "@/assets/images/header-no-frams.png";
import { cn } from "@/lib/utils";

export const getRoundConfig = (round: number) => {
  const allImageModules = import.meta.glob("/src/assets/images/*/*", {
    eager: true,
    import: "default",
  }) as Record<string, string>;
  const sourcePathsForRound = Object.keys(allImageModules).filter(
    (sourcePath) => {
      const parts = sourcePath.split("/");

      return parts.length >= 5 && parts[4] === `round-${round}`;
    }
  );

  const participants = sourcePathsForRound.map((sourcePath, index) => {
    const name = `Учасник ${index + 1}`;

    return {
      id: index + 1,
      image: allImageModules[sourcePath],
      name: name,
    };
  });

  const requiredSelections =
    round === 1 ? 5 : round === 2 ? 5 : round === 3 ? 4 : round === 4 ? 7 : 0;

  return {
    id: round,
    requiredSelections: requiredSelections,
    participants: participants,
  } as RoundConfig;
};

export default function MainMenu() {
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRound, setShowRound] = useState(false);

  const handleRoundClick = (round: number) => {
    setSelectedRound(round);
    setShowConfirmDialog(true);
  };

  const handleContinue = () => {
    setShowConfirmDialog(false);
    setShowRound(true);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setSelectedRound(null);
  };

  const handleReturnToMenu = () => {
    setShowRound(false);
    setSelectedRound(null);
  };

  if (showRound && selectedRound !== null) {
    return (
      <RoundPage
        round={getRoundConfig(selectedRound)}
        onReturnToMenu={handleReturnToMenu}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl">
      <div className="mb-8">
        <img
          src={Header}
          alt="AI Head"
          width={150}
          height={150}
          className="mx-auto"
        />
        <hr className="h-1 w-full text-blue-600 absolute left-0" />
      </div>

      <div className="flex flex-wrap justify-around gap-6 w-full place-items-center">
        {[1, 2, 3, 4].map((round) => {
          const disabled =
            LocalStoreService.getImages(`round-${round}`).length > 0;
          return (
            <button
              key={round}
              disabled={disabled}
              onClick={() => handleRoundClick(round)}
              className={cn(
                "bg-blue-700 border border-blue-200 hover:bg-blue-600 min-w-36 text-white p-8 transform scale-75 rotate-45 aspect-square flex items-center justify-center text-2xl font-bold transition-all hover:scale-[80%] shadow-lg w-[40%] max-w-[250px]",
                disabled && "opacity-50"
              )}
            >
              {/* <div className=" absolute flex gap-2 opacity-35 flex-wrap justify-center w-full">
                {LocalStoreService.getImages(`round-${round}`).map((i) => (
                  <img
                    src={i}
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                ))}
              </div> */}
              <span className="transform -rotate-45 text-shadow-lg/30 text-4xl">
                РАУНД {round}
              </span>
            </button>
          );
        })}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-blue-800 text-white border-blue-500">
          <DialogHeader>
            <DialogTitle>Підтвердити</DialogTitle>
            <DialogDescription className="text-blue-200">
              Ви збираєтеся увійти до раунду {selectedRound}. Ви хочете
              продовжити?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-transparent border-white text-white hover:bg-blue-700"
            >
              Відмінити
            </Button>
            <Button
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Продовжити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
