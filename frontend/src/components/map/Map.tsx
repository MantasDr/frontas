import { useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./map.css";

import {
  Command,
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
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Slider } from "@/components/ui/slider";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";

export type Lake = {
  id: number;
  name: string;
  location: { coordinates: [number, number] };
  depth: number;
  area: number;
  description: string;
  fishIds: number[];
};

export type Fish = {
  id: number;
  name: string;
  count: number;
  habitat: string; // Add habitat or any additional details
  description: string; // Add description or more fish details
};

// Hardcoded lake and fish data
const HARD_CODED_LAKES: Lake[] = [
  {
    id: 1,
    name: "Kauno Marios",
    location: { coordinates: [55.0123, 23.9051] },
    depth: 25,
    area: 65,
    description: "Didelis dirbtinis ežeras Kauno regione.",
    fishIds: [1, 2],
  },
  {
    id: 2,
    name: "Ežeras",
    location: { coordinates: [55.6721, 24.4567] },
    depth: 15,
    area: 12,
    description: "Ramūs gamtiniai ežeras.",
    fishIds: [2],
  },
];

const HARD_CODED_FISHES: Fish[] = [
  { id: 1, name: "Eserys", count: 5, habitat: "Upės, ežerai", description: "Plėšri žuvis, dažnai randama vandenyse su aukšta deguonies koncentracija." },
  { id: 2, name: "Lydeka", count: 8, habitat: "Ežerai ir tvenkiniai", description: "Didelė plėšri žuvis, dažnai randama sekliuose vandenyse." },
];

const normalMarker = new Icon({
  iconUrl: "../../public/marker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [-3, -76],
});

const Map: React.FC = () => {
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);
  const [sliderVal, setSliderVal] = useState([0]); // Default depth filter
  const [selectedFishes, setSelectedFishes] = useState<Fish[]>([]); // Selected fish for filtering
  const [showFilters, setShowFilters] = useState(false); // Filter toggle
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null); // Selected fish for the detailed modal

  const [lakes, setLakes] = useState(HARD_CODED_LAKES);
  const [fishes] = useState(HARD_CODED_FISHES);

  // Filter lakes based on slider and selected fish
  const filterLakes = () => {
    const filteredLakes = [];
    const fishSet = new Set(selectedFishes.map((f) => f.id));

    for (const lake of lakes) {
      if (lake.depth < sliderVal[0]) continue;
      if (fishSet.size > 0 && !lake.fishIds.some((id) => fishSet.has(id))) {
        continue;
      }
      filteredLakes.push(lake);
    }
    return filteredLakes;
  };

  const filteredLakes = filterLakes();

  const openModal = (lake: Lake) => {
    setSelectedLake(lake);
  };

  const closeModal = () => {
    setSelectedLake(null);
  };

  const openFishModal = (fish: Fish) => {
    setSelectedFish(fish);
  };

  const closeFishModal = () => {
    setSelectedFish(null);
  };

  const getFishInfoForLake = (lake: Lake) => {
    return lake.fishIds
      .map((fishId) => {
        const fish = fishes.find((f) => f.id === fishId);
        return fish ? (
          <button
            key={fish.id}
            className="text-blue-500 hover:underline"
            onClick={() => openFishModal(fish)}
          >
            {fish.name}: {fish.count} vnt.
          </button>
        ) : null;
      })
      .reduce((prev, curr) => [prev, ", ", curr]);
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      {!showFilters && (
        <Button
          className="absolute top-5 right-5 z-40 w-24 h-12"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtras
        </Button>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-slate-100 h-[320px] w-[400px] z-50 absolute top-5 right-5 shadow-lg rounded-lg animate-fadeIn">
          <div className="flex justify-between items-center px-4 py-4">
            <h2 className="text-xl font-semibold text-black">Filtras</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-black hover:text-gray-500 transition duration-200 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="px-4">
            <p className="py-4">Minimalus ežero gylis:</p>
            <Slider
              defaultValue={sliderVal}
              onValueChange={setSliderVal}
              max={50}
              step={1}
              className="w-[60%]"
            />
            <p>{sliderVal[0]} m.</p>
            <br />
            <p className="py-2">Žuvys ežere:</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                  {selectedFishes.length > 0
                    ? selectedFishes.map((fish) => fish.name).join(", ")
                    : "Pasirinkite žuvį..."}
                  <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandGroup>
                    <CommandList>
                      {fishes.map((fish) => (
                        <CommandItem
                          key={fish.id}
                          onSelect={() => {
                            const isSelected = selectedFishes.some(
                              (selectedFish) => selectedFish.id === fish.id
                            );
                            if (isSelected) {
                              setSelectedFishes(
                                selectedFishes.filter(
                                  (selectedFish) => selectedFish.id !== fish.id
                                )
                              );
                            } else {
                              setSelectedFishes([...selectedFishes, fish]);
                            }
                          }}
                        >
                          {fish.name}
                          <CheckIcon
                            className={cn("ml-auto h-4 w-4", {
                              "opacity-100": selectedFishes.some(
                                (selectedFish) => selectedFish.id === fish.id
                              ),
                              "opacity-0": !selectedFishes.some(
                                (selectedFish) => selectedFish.id === fish.id
                              ),
                            })}
                          />
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[55.3, 23.9]}
        style={{ height: "92vh", width: "100vw", zIndex: 0 }}
        zoom={8}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredLakes.map((lake) => (
          <Marker
            icon={normalMarker}
            key={lake.id}
            position={lake.location.coordinates}
            eventHandlers={{
              click: () => openModal(lake),
            }}
          />
        ))}
      </MapContainer>

      {/* Lake Modal */}
      {selectedLake && (
        <Dialog open={!!selectedLake} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{selectedLake.name}</DialogTitle>
              <DialogDescription>{selectedLake.description}</DialogDescription>
              <p>
                <strong>Gylis:</strong> {selectedLake.depth} m
              </p>
              <p>
                <strong>Plotas:</strong> {selectedLake.area} km²
              </p>
              <p>
                <strong>Žuvys ežere:</strong> {getFishInfoForLake(selectedLake)}
              </p>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {/* Fish Modal */}
      {selectedFish && (
        <Dialog open={!!selectedFish} onOpenChange={closeFishModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedFish.name}</DialogTitle>
              <DialogDescription>{selectedFish.description}</DialogDescription>
              <p>
                <strong>Randama:</strong> {selectedFish.habitat}
              </p>
              <p>
                <strong>Žuvų skaičius ežere:</strong> {selectedFish.count} vnt.
              </p>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Map;
