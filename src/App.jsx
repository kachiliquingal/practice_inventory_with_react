import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { ProductList } from './components/ProductList';
import { ProductAdd } from './components/ProductAdd';

function App() {
  return (
    <BrowserRouter>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6">Sistema de Inventario</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/add" element={<ProductAdd />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;