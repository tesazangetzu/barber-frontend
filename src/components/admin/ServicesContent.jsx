import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Modal from "./Modal";
import { TextInput, TextArea, NumberInput } from "./FormInputs";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../lib/api";
import { formatCurrency } from "../../lib/utils";

export default function ServicesContent() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
  });

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Nombre", sortable: true },
    { key: "description", label: "Descripción" },
    {
      key: "price",
      label: "Precio",
      render: (value) => formatCurrency(value),
    },
    {
      key: "duration_minutes",
      label: "Duración",
      render: (value) => `${value} min`,
    },
  ];

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Nombre requerido";
    if (!formData.price) newErrors.price = "Precio requerido";
    else if (parseFloat(formData.price) <= 0)
      newErrors.price = "Precio debe ser mayor a 0";
    if (!formData.duration_minutes)
      newErrors.duration_minutes = "Duración requerida";
    else if (parseInt(formData.duration_minutes) <= 0)
      newErrors.duration_minutes = "Duración debe ser mayor a 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add
  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration_minutes: "",
    });
    setErrors({});
    setShowModal(true);
  };

  // Handle edit
  const handleEdit = (service) => {
    setEditingId(service.id);
    setFormData(service);
    setErrors({});
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      try {
        await deleteService(id);
        setServices(services.filter((s) => s.id !== id));
      } catch (error) {
        alert("Error al eliminar servicio");
      }
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        const updated = await updateService(editingId, formData);
        setServices(services.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const created = await createService(formData);
        setServices([...services, created]);
      }
      setShowModal(false);
    } catch (error) {
      alert("Error al guardar servicio");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Gestión de Servicios
      </h1>

      <DataTable
        title="Servicios"
        columns={columns}
        data={services}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        title={editingId ? "Editar Servicio" : "Nuevo Servicio"}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        confirmText={editingId ? "Actualizar" : "Crear"}
        size="lg"
      >
        <div className="space-y-4">
          <TextInput
            label="Nombre"
            placeholder="Corte clásico"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <TextArea
            label="Descripción"
            placeholder="Descripción del servicio..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />

          <NumberInput
            label="Precio (S/)"
            placeholder="25.00"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            error={errors.price}
            step="0.01"
            min="0"
            required
          />

          <NumberInput
            label="Duración (minutos)"
            placeholder="30"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({ ...formData, duration_minutes: e.target.value })
            }
            error={errors.duration_minutes}
            step="5"
            min="5"
            required
          />
        </div>
      </Modal>
    </div>
  );
}
