import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Stack, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { addProduct } from '../api/mockApi';

export const ProductAdd = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      navigate('/');
    },
  });

  const onSubmit = (data) => {
    addMutation.mutate({ ...data, price: Number(data.price) });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Registrar Producto</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            label="Nombre del Producto"
            fullWidth
            {...register('name', { required: 'El nombre es obligatorio' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            select
            label="Categoría"
            defaultValue=""
            fullWidth
            inputProps={register('category', { required: 'Selecciona una categoría' })}
            error={!!errors.category}
            helperText={errors.category?.message}
          >
            <MenuItem value="Electrónica">Electrónica</MenuItem>
            <MenuItem value="Ropa">Ropa</MenuItem>
            <MenuItem value="Hogar">Hogar</MenuItem>
          </TextField>

          <TextField
            label="Precio"
            type="number"
            fullWidth
            {...register('price', { required: 'El precio es obligatorio', min: 1 })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={addMutation.isPending}>
            Guardar Producto
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};