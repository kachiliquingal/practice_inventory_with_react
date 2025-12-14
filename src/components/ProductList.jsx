import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Button, TextField, Paper, Typography, Stack, CircularProgress, Alert, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TablePagination,
  Chip, IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { fetchProducts, deleteProducts, toggleProductStatus } from '../api/mockApi';

export const ProductList = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProducts,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setSelectedIds([]);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleProductStatus,
    onSuccess: () => queryClient.invalidateQueries(['products']),
  });

  const filteredProducts = products.filter((product) => {
    const matchesText = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || product.category === categoryFilter;
    return matchesText && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(paginatedProducts.map(n => n.id));
      return;
    }
    setSelectedIds([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selectedIds, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selectedIds.slice(1));
    else if (selectedIndex === selectedIds.length - 1) newSelected = newSelected.concat(selectedIds.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selectedIds.slice(0, selectedIndex), selectedIds.slice(selectedIndex + 1));
    setSelectedIds(newSelected);
  };

  const isSelected = (id) => selectedIds.indexOf(id) !== -1;

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;
  if (isError) return <Alert severity="error">Error cargando inventario</Alert>;

  return (
    <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Inventario de Productos</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Buscar producto..."
          variant="outlined"
          fullWidth
          size="small"
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); setPage(0); }}
        />
        
        <TextField
          select
          label="Categoría"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Electrónica">Electrónica</MenuItem>
          <MenuItem value="Ropa">Ropa</MenuItem>
          <MenuItem value="Hogar">Hogar</MenuItem>
        </TextField>
      </Stack>

      <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedProducts.length}
                  checked={paginatedProducts.length > 0 && selectedIds.length === paginatedProducts.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell><strong>Producto</strong></TableCell>
              <TableCell><strong>Categoría</strong></TableCell>
              <TableCell><strong>Precio</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acción</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow 
                  key={row.id} hover role="checkbox" 
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} onClick={() => handleClick(row.id)} />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>${row.price}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.inStock ? "En Stock" : "Agotado"} 
                      color={row.inStock ? "success" : "error"} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                     <Tooltip title="Cambiar Estado">
                       <IconButton size="small" onClick={() => toggleMutation.mutate(row.id)}>
                         <SwapHorizIcon />
                       </IconButton>
                     </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" component={Link} to="/add" startIcon={<AddIcon />}>
          Nuevo Producto
        </Button>
        <Button 
          variant="contained" color="error" startIcon={<DeleteIcon />}
          disabled={selectedIds.length === 0}
          onClick={() => deleteMutation.mutate(selectedIds)}
        >
          Eliminar Seleccionados
        </Button>
      </Stack>
    </Paper>
  );
};