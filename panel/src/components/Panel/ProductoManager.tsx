// src/components/Panel/ProductoManager.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress";
import "./ProductoManager.css";

interface Producto {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  disponible: boolean;
  image: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const ProductoManager = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [formData, setFormData] = useState<Omit<Producto, "_id">>({
    name: "",
    category: "",
    description: "",
    price: 0,
    disponible: true,
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Asumiendo que el token está en localStorage, ajustá según tu lógica
  const token = localStorage.getItem("token") || "";

  // Configuración headers para axios
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/productos`, axiosConfig);
      if (Array.isArray(res.data)) {
        setProductos(res.data);
      } else if (Array.isArray(res.data.productos)) {
        setProductos(res.data.productos);
      } else {
        setProductos([]);
        setError("Respuesta inesperada del servidor");
      }
    } catch (err) {
      setError("Error al obtener productos");
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleOpenDialog = (producto?: Producto) => {
    if (producto) {
      setEditingProduct(producto);
      setFormData({
        name: producto.name,
        category: producto.category,
        description: producto.description,
        price: producto.price,
        disponible: producto.disponible,
        image: producto.image,
      });
      setImagePreview(producto.image);
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        price: 0,
        disponible: true,
        image: "",
      });
      setImagePreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/api/productos/${editingProduct._id}`, formData, axiosConfig);
        setSnackbar({ open: true, message: "Producto actualizado correctamente" });
      } else {
        await axios.post(`${API_URL}/api/productos`, formData, axiosConfig);
        setSnackbar({ open: true, message: "Producto creado correctamente" });
      }
      handleCloseDialog();
      fetchProductos();
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Error al guardar el producto" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que querés eliminar este producto?")) {
      try {
        await axios.delete(`${API_URL}/api/productos/${id}`, axiosConfig);
        setSnackbar({ open: true, message: "Producto eliminado correctamente" });
        fetchProductos();
      } catch {
        setSnackbar({ open: true, message: "Error al eliminar el producto" });
      }
    }
  };

  return (
    <div className="producto-manager">
      <div className="header">
        <h2>Gestión de Productos</h2>
        <Button
          startIcon={<AddCircleIcon />}
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Nuevo Producto
        </Button>
      </div>

      {loading ? (
        <div className="loading"><CircularProgress /></div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : Array.isArray(productos) && productos.length > 0 ? (
        <div className="producto-lista">
          {productos.map(producto => (
            <div className="producto-card" key={producto._id}>
              <img src={producto.image} alt={producto.name} />
              <h3>{producto.name}</h3>
              <p>{producto.description}</p>
              <p>
                <strong>
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 0,
                  }).format(producto.price)}
                </strong>
              </p>
              <div className="acciones">
                <IconButton onClick={() => handleOpenDialog(producto)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(producto._id)}><DeleteIcon color="error" /></IconButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay productos para mostrar.</p>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        <DialogContent className="form-dialog">
          <TextField label="Nombre" name="name" fullWidth value={formData.name} onChange={handleChange} />
          <TextField label="Categoría" name="category" fullWidth value={formData.category} onChange={handleChange} />
          <TextField label="Descripción" name="description" fullWidth multiline value={formData.description} onChange={handleChange} />
          <TextField label="Precio" name="price" type="number" fullWidth value={formData.price} onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imagePreview && <img src={imagePreview} className="preview" alt="preview" />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingProduct ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </div>
  );
};

export default ProductoManager;
