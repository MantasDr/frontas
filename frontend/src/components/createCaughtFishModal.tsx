import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLakes } from "@/context/LakesContext";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";

type CreateCaughtFishModalProps = {
  handleCloseModal: () => void;
};

const CreateCaughtFishModal: React.FC<CreateCaughtFishModalProps> = (props) => {
  const { lakes, isLoading, error, refetchLakes } = useLakes();
  const [fishName, setFishName] = useState<string>("");
  const [caughtDate, setCaughtDate] = useState<string>(
    new Date().toISOString()
  );
  const [fishes, setFishes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [openFishSelect, setOpenFishSelect] = useState(false);
  const [selectedLake, setSelectedLake] = useState<any>(null);
  const [selectedFish, setSelectedFish] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (lakes && lakes.length > 0) {
      setSelectedLake(lakes[0]);
    }
  }, [lakes]);

  const fetchFishes = async () => {
    try {
      const response = await axios.get("/fish");
      setFishes(response.data);
      // Handle the response and update state accordingly
    } catch (error) {
      console.error("Error fetching fishes:", error);
    }
  };

  useEffect(() => {
    fetchFishes();
  }, []);

  const handleSubmit = async () => {
    if (!selectedLake) return;

    try {
      const response = await axios.post("/fish/create-caught-entry", {
        fishId: selectedFish.id,
        lakeId: selectedLake.id,
        caughtAt: caughtDate,
      });
      toast({
        title: "Žuvis sėkmingai įrašyta",
        duration: 8000,
        className: "bg-blue-50 text-blue-600 border border-blue-200", // Apply light red background color
      });
      refetchLakes();
      closeModal();

      if (response.status === 201) {
        // closeModal(); // Assuming you have a closeModal function
      } else {
        // Handle error
        console.error("Failed to create caught fish entry:", response.data);
      }
    } catch (error) {
      console.error("Error creating caught fish entry:", error);
    }
  };

  const closeModal = () => {
    props.handleCloseModal();
  };

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Pridėti pagautą žuvį
          </DialogTitle>
        </DialogHeader>
        <div>
          <DialogDescription className="text-gray-800 p-6">
            <div className="mb-4 flex w-full justify-between ">
              <label className="font-semibold text-lg">Parinkite ežerą</label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-between"
                  >
                    {selectedLake ? selectedLake.name : "Select Lake..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandGroup>
                      <CommandList>
                        {lakes?.map((lake) => (
                          <CommandItem
                            key={lake.id}
                            value={String(lake.id)}
                            onSelect={() => {
                              setSelectedLake(lake);
                              setOpen(false);
                            }}
                          >
                            {lake.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedLake?.id === lake.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4 flex w-full justify-between ">
              <label className="font-semibold text-lg">Pasirinkite žuvį:</label>
              <Popover open={openFishSelect} onOpenChange={setOpenFishSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-between"
                  >
                    {selectedFish ? selectedFish.name : "Pasirinkite žuvį..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Ieškoti žuvies..."
                      className="h-9"
                    />
                    <CommandEmpty>Nerasta tokio žuvies.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {fishes?.map((fish) => (
                          <CommandItem
                            key={fish.id}
                            value={String(fish.id)}
                            onSelect={() => {
                              setSelectedFish(fish);
                              setOpenFishSelect(false);
                            }}
                          >
                            {fish.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedLake?.id === fish.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4 flex w-full justify-between ">
              <label className="font-semibold text-lg ">Pagavimo data: </label>
              <input
                type="datetime-local"
                value={caughtDate}
                onChange={(e) => setCaughtDate(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <Button onClick={handleSubmit}>Pateikti</Button>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCaughtFishModal;
