import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Modal from "./Modal";
import { TextInput, SelectInput } from "./FormInputs";
import {
  getSchedules,
  getBarbers,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../lib/api";
import { daysOfWeek, getDayOfWeekName, formatTime } from "../../lib/utils";

export default function SchedulesContent() {
  const [schedules, setSchedules] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    barber_id: "",
    day_of_week: "",
    start_hour: "",
    end_hour: "",
    break_start: "",
    break_end: "",
  });

  const columns = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "barber_id",
      label: "Barbero",
      render: (value, row) => row.barber?.name || "-",
    },
    {
      key: "day_of_week",
      label: "Día",
      render: (value) => getDayOfWeekName(value),
    },
    {
      key: "start_hour",
      label: "Inicio",
      render: (value) => formatTime(value),
    },
    {
      key: "end_hour",
      label: "Fin",
      render: (value) => formatTime(value),
    },
    {
      key: "break_start",
      label: "Descanso Inicio",
      render: (value) => (value ? formatTime(value) : "-"),
    },
    {
      key: "break_end",
      label: "Descanso Fin",
      render: (value) => (value ? formatTime(value) : "-"),
    },
  ];

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [schedulesData, barbersData] = await Promise.all([
          getSchedules(),
          getBarbers(),
        ]);
        setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
        setBarbers(Array.isArray(barbersData) ? barbersData : []);
      } catch (error) {
        console.error("Error loading schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.barber_id) newErrors.barber_id = "Barbero requerido";
    if (!formData.day_of_week && formData.day_of_week !== 0)
      newErrors.day_of_week = "Día requerido";
    if (!formData.start_hour) newErrors.start_hour = "Hora inicio requerida";
    if (!formData.end_hour) newErrors.end_hour = "Hora fin requerida";

    // Validate times
    if (formData.start_hour && formData.end_hour) {
      if (formData.start_hour >= formData.end_hour) {
        newErrors.end_hour = "La hora fin debe ser mayor a la hora inicio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add
  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      barber_id: "",
      day_of_week: "",
      start_hour: "",
      end_hour: "",
      break_start: "",
      break_end: "",
    });
    setErrors({});
    setShowModal(true);
  };

  // Handle edit
  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setFormData({
      barber_id: schedule.barber_id,
      day_of_week: schedule.day_of_week,
      start_hour: schedule.start_hour,
      end_hour: schedule.end_hour,
      break_start: schedule.break_start || "",
      break_end: schedule.break_end || "",
    });
    setErrors({});
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      try {
        await deleteSchedule(id);
        setSchedules(schedules.filter((s) => s.id !== id));
      } catch (error) {
        alert("Error al eliminar horario");
      }
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        barber_id: parseInt(formData.barber_id),
        day_of_week: parseInt(formData.day_of_week),
        start_hour: formData.start_hour,
        end_hour: formData.end_hour,
        ...(formData.break_start && { break_start: formData.break_start }),
        ...(formData.break_end && { break_end: formData.break_end }),
      };

      if (editingId) {
        const updated = await updateSchedule(editingId, payload);
        setSchedules(schedules.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const created = await createSchedule(payload);
        setSchedules([...schedules, created]);
      }
      setShowModal(false);
    } catch (error) {
      alert("Error al guardar horario");
    }
  };

  const barberOptions = barbers.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const dayOptions = daysOfWeek.map((d) => ({
    value: d.value,
    label: d.label,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Gestión de Horarios
      </h1>

      <DataTable
        title="Horarios"
        columns={columns}
        data={schedules}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        title={editingId ? "Editar Horario" : "Nuevo Horario"}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        confirmText={editingId ? "Actualizar" : "Crear"}
        size="lg"
      >
        <div className="space-y-4">
          <SelectInput
            label="Barbero"
            options={barberOptions}
            value={formData.barber_id}
            onChange={(e) =>
              setFormData({ ...formData, barber_id: e.target.value })
            }
            error={errors.barber_id}
            required
          />

          <SelectInput
            label="Día de la Semana"
            options={dayOptions}
            value={formData.day_of_week}
            onChange={(e) =>
              setFormData({ ...formData, day_of_week: e.target.value })
            }
            error={errors.day_of_week}
            required
          />
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <TextInput
              label="Hora Inicio (HH:mm:ss)"
              type="time"
              value={formData.start_hour}
              onChange={(e) =>
                setFormData({ ...formData, start_hour: e.target.value })
              }
              error={errors.start_hour}
              required
            />

            <TextInput
              label="Hora Fin (HH:mm:ss)"
              type="time"
              value={formData.end_hour}
              onChange={(e) =>
                setFormData({ ...formData, end_hour: e.target.value })
              }
              error={errors.end_hour}
              required
            />

            <TextInput
              label="Hora Inicio Descanso (opcional)"
              type="time"
              value={formData.break_start}
              onChange={(e) =>
                setFormData({ ...formData, break_start: e.target.value })
              }
            />

            <TextInput
              label="Hora Fin Descanso (opcional)"
              type="time"
              value={formData.break_end}
              onChange={(e) =>
                setFormData({ ...formData, break_end: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
