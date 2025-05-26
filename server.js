const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

const menu = JSON.parse(fs.readFileSync('./menu.json', 'utf-8'));

app.use(express.json());

const categorias = {
  'entradas': menu.entradas,
  'platos-fuertes': menu.platosFuertes,
  'postres': menu.postres,
  'bebidas': menu.bebidas
};

function buscarPlatillo(categoria, id) {
    for (const item of categoria) {
      if (item.id == id) {
        return item; 
      }
    }
    return null; 
}

app.get('/menu', (req, res) => {
  res.json({
    descripcion: 'Menu digital de restaurante ficticio',  // Cambiado aquí
    categorias: ['Entradas','Platos fuertes','Postres','Bebidas']
  });
});

app.get('/menu/:categoria', (req, res) => {
  const { categoria } = req.params;
  if (categoria in categorias) {
    res.json(categorias[categoria]);
  } else {
    res.status(404).json({ 
      error: `${categoria} no es una categoria valida`,
    });
  }
});

app.get('/menu/:categoria/:id', (req, res) => {
  const { categoria, id } = req.params;

  if (!(categoria in categorias)) {
    return res.status(404).json({ 
        error: `${categoria} no es una categoria valida`,
    });
  }

  const platillo = buscarPlatillo(categorias[categoria], id);
  
  if (platillo) {
    res.json(platillo);
  } else {
    res.status(404).json({ 
      error: 'Platillo no encontrado',
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Esta ruta no existe',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor inicializado`);
});