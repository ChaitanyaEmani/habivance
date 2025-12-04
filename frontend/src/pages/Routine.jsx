import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "../components/common/Modal";
import Timer from "../components/Timer";
import { toast } from "react-toastify";
import Loading from "../components/common/Loading";
import AddHabitForm from "../components/routine/AddHabitForm";
import { Target,CheckCircle2,Flame,Award } from "lucide-react";
// Import separated components
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import SearchAndFilters from "../components/routine/SearchAndFilters";
import HabitCard from "../components/routine/HabitCard";
import EmptyState from "../components/routine/EmptyState";
import FloatingAddButton from "../components/routine/FloatingAddButton";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Routine = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [currentRoutineId, setCurrentRoutineId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    description: "",
    frequency: "daily",
    priority: "medium",
  });

  // Get unique categories from routines
  const categories = ["all", ...new Set(routines.map((r) => r.category))];

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!formData.name.trim()) {
      alert("Please enter a habit name");
      return;
    }

    const normalizedName = formData.name.toLowerCase().trim();
    const isDuplicate = routines.some(
      (routine) => routine.name.toLowerCase().trim() === normalizedName
    );

    if (isDuplicate) {
      alert("A habit with this name already exists. Please choose a different name.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/custom-habits/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newHabit = res.data.data || res.data.habit || res.data;

      if (newHabit && newHabit._id) {
        const alreadyExists = routines.some((r) => r._id === newHabit._id);

        if (!alreadyExists) {
          setRoutines((prev) => [...prev, newHabit]);
        }

        setFormData({
          name: "",
          category: "Nutrition",
          description: "",
          frequency: "daily",
          priority: "medium",
        });

        setAddOpen(false);
        toast.success(res.data.message);
      } else {
        await getRoutines();
        setFormData({
          name: "",
          category: "Nutrition",
          description: "",
          frequency: "daily",
          priority: "medium",
        });
        setAddOpen(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error adding habit:", error);

      if (
        error.response?.status === 409 ||
        error.response?.status === 400 ||
        error.response?.data?.message?.toLowerCase().includes("duplicate") ||
        error.response?.data?.message?.toLowerCase().includes("already exists") ||
        error.response?.data?.message?.toLowerCase().includes("exist")
      ) {
        toast.error("This habit already exists in your list.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to add habit. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoutines = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/habits/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const uniqueRoutines = [];
      const seenNames = new Set();

      for (const routine of res.data.data) {
        const normalizedName = routine.name.toLowerCase().trim();

        if (!seenNames.has(normalizedName)) {
          seenNames.add(normalizedName);
          uniqueRoutines.push(routine);
        }
      }

      setRoutines(uniqueRoutines);
      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage);
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoutines();
  }, []);

  // Filter routines
  const filteredRoutines = routines.filter((routine) => {
    const statusMatch =
      filter === "all" ||
      (filter === "completed" && routine.streak > 0) ||
      (filter === "pending" && routine.streak === 0);

    const categoryMatch =
      categoryFilter === "all" || routine.category === categoryFilter;

    const searchMatch =
      routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.category.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && categoryMatch && searchMatch;
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate stats
  const totalHabits = routines.length;
  const completedToday = routines.filter((r) => r.streak > 0).length;
  const longestStreak = routines.reduce(
    (max, r) => Math.max(max, r.longestStreak || 0),
    0
  );
  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleDelete = async (routineId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/api/habits/${routineId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRoutines((prev) => prev.filter((routine) => routine._id !== routineId));
      toast.success(res.data.message);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage);
      console.log(error.message);
    }
  };

  const handleComplete = async (routineId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/habits/complete/${routineId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.data || res.data.habit) {
        const updatedHabit = res.data.data || res.data.habit;

        setRoutines((prev) =>
          prev.map((routine) =>
            routine._id === routineId ? updatedHabit : routine
          )
        );
        toast.success(res.data.message);
      } else {
        await getRoutines();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error completing habit:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark habit as completed"
      );
    }
  };

  const handleStartExercise = (routineId) => {
    setCurrentRoutineId(routineId);
    setModalOpen(true);
  };

  if (loading) {
    return <Loading text="your routines" />;
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader onAddClick={() => setAddOpen(true)} title="My Daily Routines" page="routine" subTitle="Track and maintain your healthy habits"/>

        {/* Stats Cards */}
         {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">  
          <StatCard title="Total Habits" value={totalHabits} subtitle="" icon={Target} color="blue" />
          <StatCard title="Completed Today" value={completedToday} subtitle="" icon={CheckCircle2} color="green" />
          <StatCard title="Longest Streak" value={longestStreak} subtitle="" icon={Flame} color="orange" />
          <StatCard title="Completion Rate" value={completionRate} subtitle="" icon={Award} color="purple" />
        </div>
        {/* Filters and Search */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
        />

        {/* Routines Grid */}
        {filteredRoutines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutines.map((routine) => (
              <HabitCard
                key={routine._id}
                routine={routine}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onStartExercise={handleStartExercise}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            filter={filter}
            onAddClick={() => setAddOpen(true)}
          />
        )}

        {/* Floating Add Button */}
        <FloatingAddButton onClick={() => setAddOpen(true)} />
      </div>

      {/* Add Habit Modal */}
      {addOpen && (
        <Modal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          title="Add New Habit"
        >
          <AddHabitForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setAddOpen={setAddOpen}
            formData={formData}
          />
        </Modal>
      )}

      {/* Exercise Timer Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Start Exercise"
        >
          <Timer
            habitId={currentRoutineId}
            onComplete={(updatedHabit) => {
              setRoutines((prev) =>
                prev.map((r) => (r._id === currentRoutineId ? updatedHabit : r))
              );
              setModalOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Routine;