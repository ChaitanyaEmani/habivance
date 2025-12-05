import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Target, CheckCircle2, Circle, Award } from "lucide-react";
import Modal from "../components/common/Modal";
// import StatCard from "../components/routine/StatCard";
import FilterSection from "../components/routine/FilterSection";
import HabitCard from "../components/routine/HabitCard";
import AddHabitForm from "../components/routine/AddHabitForm";
import EmptyState from "../components/routine/EmptyState";
import StatCard from "../components/common/StatCard";
import Loading from "../components/common/Loading";
import PageHeader from "../components/common/PageHeader";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const Routine = () => {
  const token = localStorage.getItem("token");
  const [routines, setRoutines] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    habit: "",
    category: "",
    description: "",
    priority: "medium",
    duration: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch routines
  const getRoutines = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/habits/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const unique = [];
      const seen = new Set();

      for (const routine of res.data.data) {
        const key = routine.habit.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(routine);
        }
      }

      setRoutines(unique);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoutines();
  }, []);

  // Helper function to check if habit is completed today
  const isHabitCompletedToday = (habit) => {
    if (!habit.habitHistory || habit.habitHistory.length === 0) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastEntry = habit.habitHistory[habit.habitHistory.length - 1];
    if (!lastEntry) return false;

    const lastEntryDate = new Date(lastEntry.date);
    lastEntryDate.setHours(0, 0, 0, 0);

    return (
      lastEntryDate.getTime() === today.getTime() &&
      lastEntry.status === "completed"
    );
  };

  const handleComplete = async (routineId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/habits/complete/${routineId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.data?.error) {
        toast.info(res.data.data.message);
        return;
      }

      if (res.data && res.data.data) {
        setRoutines((prevRoutines) =>
          prevRoutines.map((routine) =>
            routine._id === routineId ? res.data.data : routine
          )
        );
        toast.success("Habit marked as completed! 🎉");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to mark as completed";
      toast.error(errorMsg);
      console.error(error);
    }
  };

  const handleDelete = async (routineId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/habits/${routineId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRoutines((prevRoutines) =>
        prevRoutines.filter((routine) => routine._id !== routineId)
      );

      toast.success("Habit deleted successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to delete habit";
      toast.error(errorMsg);
      console.error(error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.habit.trim()) {
      toast.error("Habit name is required");
      return;
    }

    try {
      setSubmitting(true);
      
      const res = await axios.post(
        `${API_URL}/api/habits/add`,
        {
          habit: formData.habit,
          category: formData.category || "General",
          description: formData.description,
          priority: formData.priority,
          duration: formData.duration ? parseInt(formData.duration) : undefined
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.data) {
        setRoutines((prev) => [...prev, res.data.data]);
        toast.success("Habit added successfully! 🎉");
        
        setFormData({
          habit: "",
          category: "",
          description: "",
          priority: "medium",
          duration: ""
        });
        setOpen(false);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add habit";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Dynamic categories
  const categories = useMemo(() => {
    const set = new Set();
    routines.forEach((r) => r.category && set.add(r.category));
    return Array.from(set).sort();
  }, [routines]);

  // Calculate statistics
  const stats = useMemo(() => {
    const completed = routines.filter((r) => isHabitCompletedToday(r)).length;
    const pending = routines.length - completed;
    const activeStreaks = routines.filter((r) => (r.streak || 0) > 0).length;
    const bestStreak = Math.max(...routines.map((r) => r.longestStreak || 0), 0);

    return { completed, pending, activeStreaks, bestStreak };
  }, [routines]);

  // Apply Filters
  const filtered = useMemo(() => {
    return routines.filter((r) => {
      const matchesSearch = r.habit.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter ? r.priority === priorityFilter : true;
      const matchesCategory = categoryFilter ? r.category === categoryFilter : true;
      const isCompleted = isHabitCompletedToday(r);
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
          ? isCompleted
          : !isCompleted;

      return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
    });
  }, [routines, search, priorityFilter, categoryFilter, statusFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setPriorityFilter("");
    setCategoryFilter("");
    setStatusFilter("all");
  };

  const hasActiveFilters = search || priorityFilter || categoryFilter || statusFilter !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <PageHeader title="My Routine" subTitle="Track and manage your daily habits" page="routine" onAddClick={()=>setOpen(true)} />
            
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Target}
            title="Total Habits"
            value={routines.length}
            color="blue" />
            <StatCard icon={CheckCircle2}
            title="Completed Today"
            value={stats.completed}
            color="green" />
            <StatCard icon={Circle}
            title="Pending Today"
            value={stats.pending}
            color="orange" />
            <StatCard icon={Award}
            title="Best Streak"
            value={stats.bestStreak}
            color="purple" />
          </div>
        </div>

        {/* Filters Section */}
        <FilterSection
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          filteredCount={filtered.length}
          totalCount={routines.length}
        />

        {/* Loading State */}
        {loading ? (
           <Loading text="routines"/>
        ) : filtered.length === 0 ? (
          <EmptyState 
            hasActiveFilters={hasActiveFilters} 
            onClearFilters={clearFilters} 
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <HabitCard
                key={item._id}
                habit={item}
                isCompleted={isHabitCompletedToday(item)}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      {open && (
        <Modal onClose={() => setOpen(false)} isOpen={open} title="Add New Habit">
          <AddHabitForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
};

export default Routine;