import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile: React.FC = () => {
  const [city, setCity] = useState("");
  const [realname, setRealname] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState("");
  const [lastWeekRank, setLastWeekRank] = useState(5); // Hardcoded rank for last week
  const [currentRank, setCurrentRank] = useState(3); // Hardcoded current rank
  const [rating, setRating] = useState(0);
  const [profilePicture, setProfilePicture] = useState("Sigma.png");
  const [backgroundImage, setBackgroundImage] = useState("Lydeka.png");
  
  useEffect(() => {
    axios
      .get("http://localhost:8081/userget", { withCredentials: true }) // Ensure cookies are sent
      .then((response) => {
        console.log("YEYEYEYE: :", response.data);
        setCity(response.data.city);
        setRealname(response.data.name);
        setSurname(response.data.surname);
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error.response?.data || error.message);
        setError("Failed to fetch profile. Please try again later.");
      });
  }, []);
  
  

  const handleSaveProfile = () => {
    axios
      .put(`http://localhost:8081/userupdate`, {
        username: username,
        city: city,
      })
      .then(() => {
        axios.get(`http://localhost:8081/userget`).then((response) => {
          setCity(response.data.city);
          setRealname(response.data.realname);
          setSurname(response.data.surname);
          setUsername(response.data.username);
        });
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert(error.response?.data?.error || 'Failed to update profile.');
      });
  };

  const handleDeleteProfile = () => {
    axios
      .delete(`http://localhost:8081/userdelete`)
      .then(() => {
        alert('Profile deleted');
      })
      .catch((error) => {
        console.error('Error deleting profile:', error);
        alert(error.response?.data?.error || 'Failed to delete profile.');
      });
  };

    // Design edit function
    const handleDesignSave = (profilePicture: string, backgroundImage: string) => {
      setProfilePicture(profilePicture);
      setBackgroundImage(backgroundImage);
      setShowDesignModal(false);
    };

  
  return (
    <div className="relative p-6 flex flex-col items-center justify-center"
    style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Profile Info Section */}
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className="w-40 h-40 rounded-full bg-cover bg-center border-4 border-gray-300"
          style={{ backgroundImage: `url(${profilePicture})` }}
        ></div>
         <p className="mt-1 text-lg font-bold">Slapyvardis: {username}</p>
        <h2 className="mt-4 text-2xl font-bold">Vardas: {realname}</h2>
        <p className="mt-1 text-lg font-bold">Pavardė: {surname}</p>
        <p className="mt-1 text-lg font-bold">Miestas: {city}</p>
        <div className="flex items-center mt-2">
          <span className="mr-2 text-lg font-bold">Įvertinimas:</span>
          <div>{Array.from({ length: 5 }, (_, index) => (index < rating ? "★" : "☆")).join("")}</div>
        </div>
      </div>

      {/* Profile Edit Button */}
      <Button className="mt-6" onClick={() => setShowEditModal(true)}>
        Profilio redagavimas
      </Button>

      {/* Design Edit Button */}
      <Button className="mt-4" onClick={() => setShowDesignModal(true)}>
        Dizaino redagavimas
      </Button>

      {/* Leaderboard Button */}
      <Button className="mt-4" onClick={() => setShowLeaderboardModal(true)}>
        Lyderių lentelė
      </Button>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={() => setShowEditModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profilių redagavimas</DialogTitle>
            <DialogDescription>
              Redaguokite savo informaciją.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              name="Vardas"
              value={realname}
              onChange={(e) => setRealname(e.target.value)}
            />
            <Input
              name="Miestas"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              name="Pavardė"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <Button className="mt-4" onClick={handleSaveProfile}>
              Išsaugoti
            </Button>

            <Button
              variant="destructive"
              className="mt-4"
              onClick={() => setShowDeleteProfileModal(true)}
            >
              Ištrinti profilį
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Profile Modal */}
      <Dialog open={showDeleteProfileModal} onOpenChange={() => setShowDeleteProfileModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ar tikrai norite ištrinti profilį?</DialogTitle>
            <DialogDescription>
              Įveskite savo slaptažodį, kad patvirtintumėte šią operaciją.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              name="Slaptažodis"
              type="password"
              value={passwordToDelete}
              onChange={(e) => setPasswordToDelete(e.target.value)}
            />
            <Button
              variant="destructive"
              className="mt-4"
              onClick={handleDeleteProfile}
            >
              Ištrinti
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDesignModal} onOpenChange={() => setShowDesignModal(false)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Dizaino redagavimas</DialogTitle>
                <DialogDescription>Pasirinkite savo profilio paveikslėlį ir foną.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
                {/* Dropdown for Profile Picture */}
                <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                        Profilio nuotrauka
                    </label>
                    <select
                        id="profilePicture"
                        value={profilePicture}
                        onChange={(e) => setProfilePicture(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Pasirinkite paveikslėlį</option>
                        <option value="Sigma.png">Sigma</option>
                        <option value="url2.jpg">Paveikslėlis 2</option>
                        <option value="url3.jpg">Paveikslėlis 3</option>
                    </select>
                </div>

                {/* Dropdown for Background Image */}
                <div>
                    <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700">
                        Fono nuotrauka
                    </label>
                    <select
                        id="backgroundImage"
                        value={backgroundImage}
                        onChange={(e) => setBackgroundImage(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Pasirinkite foną</option>
                        <option value="Lydeka.png">Lydeka</option>
                        <option value="bg2.jpg">Fonas 2</option>
                        <option value="bg3.jpg">Fonas 3</option>
                    </select>
                </div>

                {/* Save Button */}
                <Button
                    className="mt-4"
                    onClick={() => handleDesignSave(profilePicture, backgroundImage)}
                >
                    Save
                </Button>
            </div>
        </DialogContent>
    </Dialog>

      {/* Leaderboard Modal */}
      <Dialog open={showLeaderboardModal} onOpenChange={() => setShowLeaderboardModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lyderių lentelė</DialogTitle>
            <DialogDescription>
              Jūsų pozicija ir statistika.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p>Praėjusią savaitę: {lastWeekRank} vieta</p>
            <p>Šiuo metu: {currentRank} vieta</p>
            <Button onClick={() => setShowLeaderboardModal(false)} className="mt-4">
              Užbaigti
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
  
};

export default Profile;
