import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Modal from "./Modal";
import { TextInput, TextArea, NumberInput } from "./FormInputs";
import {
  getBarbers,
  createBarber,
  updateBarber,
  deleteBarber,
} from "../../lib/api";
import { validateEmail, validatePhone } from "../../lib/utils";

export default function BarbersContent() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience_years: "",
    bio: "",
  });

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Nombre", sortable: true },
    { key: "email", label: "Email" },
    { key: "phone", label: "Teléfono" },
    { key: "specialty", label: "Especialidad" },
    { key: "experience_years", label: "Años Exp." },
  ];

  // Load barbers
  useEffect(() => {
    const loadBarbers = async () => {
      try {
        const data = await getBarbers();
        setBarbers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading barbers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBarbers();
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Nombre requerido";
    if (!formData.email?.trim()) newErrors.email = "Email requerido";
    else if (!validateEmail(formData.email)) newErrors.email = "Email inválido";
    if (!formData.phone?.trim()) newErrors.phone = "Teléfono requerido";
    else if (!validatePhone(formData.phone))
      newErrors.phone = "Teléfono inválido";
    if (!formData.specialty?.trim())
      newErrors.specialty = "Especialidad requerida";
    if (!formData.experience_years)
      newErrors.experience_years = "Años de experiencia requeridos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add
  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      experience_years: "",
      bio: "",
    });
    setErrors({});
    setShowModal(true);
  };

  // Handle edit
  const handleEdit = (barber) => {
    setEditingId(barber.id);
    setFormData(barber);
    setErrors({});
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este barbero?")) {
      try {
        await deleteBarber(id);
        setBarbers(barbers.filter((b) => b.id !== id));
      } catch (error) {
        alert("Error al eliminar barbero");
      }
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        const updated = await updateBarber(editingId, formData);
        setBarbers(barbers.map((b) => (b.id === editingId ? updated : b)));
      } else {
        const created = await createBarber(formData);
        setBarbers([...barbers, created]);
      }
      setShowModal(false);
    } catch (error) {
      alert("Error al guardar barbero");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        Gestión de Barberos
      </h1>

      <DataTable
        title="Barberos"
        columns={columns}
        data={barbers}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        title={editingId ? "Editar Barbero" : "Nuevo Barbero"}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        confirmText={editingId ? "Actualizar" : "Crear"}
        size="lg"
      >
        <div className="space-y-4">
          <TextInput
            label="Nombre"
            placeholder="Juan García"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="juan@barberia.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            required
          />

          <TextInput
            label="Teléfono"
            placeholder="+1 234 567 8900"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            error={errors.phone}
            required
          />

          <TextInput
            label="Especialidad"
            placeholder="Cortes modernos, Barbería clásica"
            value={formData.specialty}
            onChange={(e) =>
              setFormData({ ...formData, specialty: e.target.value })
            }
            error={errors.specialty}
            required
          />

          <NumberInput
            label="Años de Experiencia"
            placeholder="5"
            value={formData.experience_years}
            onChange={(e) =>
              setFormData({ ...formData, experience_years: e.target.value })
            }
            error={errors.experience_years}
            min="0"
            step="1"
            required
          />

          <TextArea
            label="Biografía"
            placeholder="Información adicional del barbero..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
}
