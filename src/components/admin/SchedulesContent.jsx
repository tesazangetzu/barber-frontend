import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { SelectInput, TextInput } from "./FormInputs";
import {
  getSchedules,
  getBarbers,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../lib/api";
import { daysOfWeek, getDayOfWeekName, formatTime } from "../../lib/utils";
import { ChevronDown, ChevronRight, Trash2, Edit2, Plus, Clock } from "lucide-react";

export default function SchedulesContent() {
  const [schedules, setSchedules] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    barber_id: "",
    start_hour: "",
    end_hour: "",
    break_start: "",
    break_end: "",
    days: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [scheds, barbs] = await Promise.all([
          getSchedules(),
          getBarbers(),
        ]);
        setSchedules(Array.isArray(scheds) ? scheds : []);
        setBarbers(Array.isArray(barbs) ? barbs : []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const barberSchedules = barbers.map((b) => ({
    ...b,
    schedules: schedules.filter((s) => s.barber_id === b.id).sort((a, b) => a.day_of_week - b.day_of_week),
  }));

  const toggleDay = (dayVal) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(dayVal)
        ? prev.days.filter((d) => d !== dayVal)
        : [...prev.days, dayVal],
    }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.barber_id) errs.barber_id = "Selecciona un barbero";
    if (!formData.start_hour) errs.start_hour = "Hora inicio requerida";
    if (!formData.end_hour) errs.end_hour = "Hora fin requerida";
    if (formData.start_hour && formData.end_hour && formData.start_hour >= formData.end_hour) {
      errs.end_hour = "Debe ser mayor a la hora de inicio";
    }
    if (formData.days.length === 0) errs.days = "Selecciona al menos un día";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    setEditingId(null);
    setEditingDay(null);
    setFormData({ barber_id: "", start_hour: "", end_hour: "", break_start: "", break_end: "", days: [] });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setEditingDay(schedule.day_of_week);
    setFormData({
      barber_id: String(schedule.barber_id),
      start_hour: stripSeconds(schedule.start_hour),
      end_hour: stripSeconds(schedule.end_hour),
      break_start: stripSeconds(schedule.break_start),
      break_end: stripSeconds(schedule.break_end),
      days: [schedule.day_of_week],
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const padTime = (t) => (t ? `${t}:00` : t);
      const payload = {
        barber_id: Number(formData.barber_id),
        start_hour: padTime(formData.start_hour),
        end_hour: padTime(formData.end_hour),
        ...(formData.break_start && { break_start: padTime(formData.break_start) }),
        ...(formData.break_end && { break_end: padTime(formData.break_end) }),
      };

      if (editingId) {
        const updated = await updateSchedule(editingId, payload);
        setSchedules((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const created = await Promise.all(
          formData.days.map((day) => createSchedule({ ...payload, day_of_week: day }))
        );
        setSchedules((prev) => [...prev, ...created]);
      }
      setShowModal(false);
    } catch {
      alert("Error al guardar horarios");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este horario?")) return;
    try {
      await deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Error al eliminar horario");
    }
  };

  const barberOptions = barbers.map((b) => ({ value: String(b.id), label: b.name }));

  const stripSeconds = (t) => (t ? t.substring(0, 5) : "");

  const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sat, Sun

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Horarios</h1>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Barberos</h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            Nuevo Horario
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : barberSchedules.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay barberos registrados</div>
        ) : (
          <div>
            {barberSchedules.map((barber) => {
              const isOpen = expandedId === barber.id;
              const scheds = barber.schedules;
              return (
                <div key={barber.id} className="border-b border-gray-100 last:border-b-0">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : barber.id)}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isOpen ? <ChevronDown size={18} className="shrink-0 text-gray-400" /> : <ChevronRight size={18} className="shrink-0 text-gray-400" />}
                      <span className="font-semibold text-gray-800">{barber.name}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${scheds.length > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {scheds.length} horario{scheds.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {scheds.length > 0 && (
                      <div className="hidden md:flex items-center gap-3 text-sm text-gray-500 ml-4 shrink-0">
                        <Clock size={14} />
                        <span>{scheds.map((s) => getDayOfWeekName(s.day_of_week).slice(0, 3)).join(", ")}</span>
                        <span className="font-mono">{formatTime(scheds[0].start_hour)}–{formatTime(scheds[0].end_hour)}</span>
                      </div>
                    )}
                  </button>

                  {isOpen && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      {scheds.length === 0 ? (
                        <div className="px-4 md:px-16 py-6 text-sm text-gray-500">
                          Este barbero no tiene horarios configurados.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="px-4 md:px-6 py-3 text-left text-gray-600 font-semibold">Día</th>
                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Inicio</th>
                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Fin</th>
                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Descanso</th>
                                <th className="px-4 py-3 text-right text-gray-600 font-semibold">Acción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dayOrder.map((dow) => {
                                const s = scheds.find((x) => x.day_of_week === dow);
                                if (!s) return null;
                                return (
                                  <tr key={s.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                                    <td className="px-4 md:px-6 py-3 font-medium text-gray-800">
                                      {getDayOfWeekName(dow)}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-gray-700">{formatTime(s.start_hour)}</td>
                                    <td className="px-4 py-3 font-mono text-gray-700">{formatTime(s.end_hour)}</td>
                                    <td className="px-4 py-3 font-mono text-gray-500">
                                      {s.break_start && s.break_end
                                        ? `${formatTime(s.break_start)}–${formatTime(s.break_end)}`
                                        : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <button
                                          onClick={() => handleEdit(s)}
                                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Editar horario"
                                        >
                                          <Edit2 size={16} />
                                        </button>
                                        <button
                                          onClick={() => handleDelete(s.id)}
                                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Eliminar horario"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        title={editingId ? "Editar Horario" : "Nuevo Horario"}
        onClose={() => !submitting && setShowModal(false)}
        onConfirm={handleSubmit}
        confirmText={submitting ? "Guardando..." : editingId ? "Actualizar" : "Crear Horarios"}
        size="xl"
      >
        <div className="space-y-5">
          <SelectInput
            label="Barbero"
            options={barberOptions}
            value={formData.barber_id}
            onChange={(e) => setFormData({ ...formData, barber_id: e.target.value })}
            error={errors.barber_id}
            required
            disabled={!!editingId}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Hora Inicio"
              type="time"
              value={formData.start_hour}
              onChange={(e) => setFormData({ ...formData, start_hour: e.target.value })}
              error={errors.start_hour}
              required
            />
            <TextInput
              label="Hora Fin"
              type="time"
              value={formData.end_hour}
              onChange={(e) => setFormData({ ...formData, end_hour: e.target.value })}
              error={errors.end_hour}
              required
            />
            <TextInput
              label="Inicio Descanso (opcional)"
              type="time"
              value={formData.break_start}
              onChange={(e) => setFormData({ ...formData, break_start: e.target.value })}
            />
            <TextInput
              label="Fin Descanso (opcional)"
              type="time"
              value={formData.break_end}
              onChange={(e) => setFormData({ ...formData, break_end: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Días de la Semana <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {daysOfWeek.map((d) => {
                const isEditingThisDay = editingId && d.value === editingDay;
                return (
                  <label
                    key={d.value}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isEditingThisDay
                        ? "bg-blue-600 text-white border-blue-600 cursor-default"
                        : editingId
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : formData.days.includes(d.value)
                            ? "bg-blue-600 text-white border-blue-600 cursor-pointer"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={editingId ? isEditingThisDay : formData.days.includes(d.value)}
                      onChange={() => !editingId && toggleDay(d.value)}
                      disabled={!!editingId}
                      className="sr-only"
                    />
                    {d.label.slice(0, 3)}
                  </label>
                );
              })}
            </div>
            {errors.days && <p className="text-red-600 text-sm mt-1">{errors.days}</p>}
            {editingId && (
              <p className="text-gray-500 text-xs mt-2">El día se bloquea al editar. Para cambiar el día, eliminá y creá un nuevo horario.</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
