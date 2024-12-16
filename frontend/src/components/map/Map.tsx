import { useState, useEffect } from "react";
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
  id_Lake: number;
  name: string;
  depth: number;
  shores: number; // Number of shores added as a variable
  x: number;
  y: number;
  description: string;
  fishes: Fish[]; // Fish associated with the lake
};

export type Fish = {
  id: number;
  name: string;
  count: number;
  habitat: string;
  description: string;
};

// Hardcoded fish data
const HARD_CODED_FISHES: Fish[] = [
  {
    id: 1,
    name: "Eserys",
    count: 5,
    habitat: "Upės, ežerai",
    description:
      "Plėšri žuvis, dažnai randama vandenyse su aukšta deguonies koncentracija.",
  },
  {
    id: 2,
    name: "Lydeka",
    count: 8,
    habitat: "Ežerai ir tvenkiniai",
    description: "Didelė plėšri žuvis, dažnai randama sekliuose vandenyse.",
  },
];

const normalMarker = new Icon({
  iconUrl: "../../public/marker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [-3, -76],
});

const Map: React.FC = () => {
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);
  const [sliderVal, setSliderVal] = useState([0]);
  const [shoreVal, setShoreVal] = useState([0]);
  const [selectedFishes, setSelectedFishes] = useState<Fish[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
  const [fishes] = useState(HARD_CODED_FISHES);

  // Fetch lakes from the backend API
  useEffect(() => {
    const fetchLakes = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/lakes");
        if (!response.ok) {
          throw new Error("Failed to fetch lakes");
        }
        const data = await response.json();
        const mappedLakes = data.map((lake: any) => ({
          id_Lake: lake.id_Lake,
          name: lake.name,
          depth: lake.depth,
          shores: lake.shores || 0,
          x: lake.x,
          y: lake.y,
          description: lake.description || "No description available",
          fishes: lake.fishes || [],
        }));
        setLakes(mappedLakes);
      } catch (error) {
        console.error("Error fetching lakes:", error);
      }
    };

    fetchLakes();
  }, []);

  // Filter lakes based on depth, shores, and fish
  const filterLakes = () => {
    return lakes.filter(
      (lake) =>
        lake.depth >= sliderVal[0] &&
        lake.shores >= shoreVal[0] &&
        (selectedFishes.length === 0 ||
          selectedFishes.some((fish) => lake.fishes.some((lf) => lf.id === fish.id)))
    );
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
        <div className="bg-slate-100 h-[420px] w-[400px] z-50 absolute top-5 right-5 shadow-lg rounded-lg animate-fadeIn">
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
          {/* Depth Filter */}
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
          </div>

          {/* Shore Filter */}
          <div className="px-4 mt-4">
            <p className="py-4">Minimalus krantų skaičius:</p>
            <Slider
              defaultValue={shoreVal}
              onValueChange={setShoreVal}
              max={10}
              step={1}
              className="w-[60%]"
            />
            <p>{shoreVal[0]} krantai.</p>
          </div>

          {/* Fish Filter */}
          <div className="px-4 mt-4">
            <p className="py-4">Pasirinkite žuvų tipą:</p>
            {fishes.map((fish) => (
              <div key={fish.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`fish-${fish.id}`}
                  checked={selectedFishes.some((f) => f.id === fish.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFishes([...selectedFishes, fish]);
                    } else {
                      setSelectedFishes(
                        selectedFishes.filter((f) => f.id !== fish.id)
                      );
                    }
                  }}
                />
                <label htmlFor={`fish-${fish.id}`}>{fish.name}</label>
              </div>
            ))}
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
            key={lake.id_Lake}
            position={[lake.y, lake.x]} // Use y (latitude) and x (longitude)
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
