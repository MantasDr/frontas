import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // Hardcoded profile data
  const [profile, setProfile] = useState({
    username: "user123",
    email: "user123@example.com",
    phoneNumber: "+37060000000",
    rating: 4.5,
    profilePicture: "Sigma.png",
    backgroundImage: "Lydeka.png",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);
  const [newEmail, setNewEmail] = useState(profile.email);
  const [newPhoneNumber, setNewPhoneNumber] = useState(profile.phoneNumber);
  const [passwordToDelete, setPasswordToDelete] = useState("");
  const [lastWeekRank, setLastWeekRank] = useState(5); // Hardcoded rank for last week
  const [currentRank, setCurrentRank] = useState(3); // Hardcoded current rank

  // Edit profile function
  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      username: newUsername,
      email: newEmail,
      phoneNumber: newPhoneNumber,
    });
    setShowEditModal(false);
  };

  // Delete profile function
  const handleDeleteProfile = () => {
    // Here you should add the real logic for deleting the profile
    alert("Profilis sėkmingai ištrintas");
    navigate("/"); // Redirect to homepage after deletion
  };

  // Design edit function
  const handleDesignSave = (profilePicture: string, backgroundImage: string) => {
    setProfile({
      ...profile,
      profilePicture,
      backgroundImage,
    });
    setShowDesignModal(false);
  };

  return (
    <div className="relative p-6 flex flex-col items-center justify-center"
    style={{ backgroundImage: `url(${profile.backgroundImage})` }}>
      {/* Profile Info Section */}
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className="w-40 h-40 rounded-full bg-cover bg-center border-4 border-gray-300"
          style={{ backgroundImage: `url(${profile.profilePicture})` }}
        ></div>
        <h2 className="mt-4 text-2xl font-bold">Vardas: {profile.username}</h2>
        <p className="mt-1 text-lg font-bold">El. paštas: {profile.email}</p>
        <p className="mt-1 text-lg font-bold">Telefono numeris: {profile.phoneNumber}</p>
        <div className="flex items-center mt-2">
          <span className="mr-2 text-lg font-bold">Įvertinimas:</span>
          <div>{Array.from({ length: 5 }, (_, index) => (index < profile.rating ? "★" : "☆")).join("")}</div>
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
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Input
              name="El. paštas"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Input
              name="Telefono numeris"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
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

      {/* Design Edit Modal */}
      <Dialog open={showDesignModal} onOpenChange={() => setShowDesignModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dizaino redagavimas</DialogTitle>
            <DialogDescription>Pasirinkite savo profilio paveikslėlį ir foną.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              label="Profilio nuotrauka URL"
              value={profile.profilePicture}
              onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
            />
            <Input
              label="Fono nuotrauka URL"
              value={profile.backgroundImage}
              onChange={(e) => setProfile({ ...profile, backgroundImage: e.target.value })}
            />
            <Button
              className="mt-4"
              onClick={() => handleDesignSave(profile.profilePicture, profile.backgroundImage)}
            >
              Išsaugoti dizainą
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
