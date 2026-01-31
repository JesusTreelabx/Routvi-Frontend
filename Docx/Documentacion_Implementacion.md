# Documentación de Implementación: Módulo de Menú

Este documento detalla las funcionalidades implementadas para la gestión del menú (Categorías y Productos) en el proyecto Routvi-Frontend.

## 1. Visión General
El objetivo fue crear un sistema completo "CRUD" (Crear, Leer, Actualizar, Borrar) para que el dueño del negocio pueda gestionar su catálogo de productos de manera autónoma.

## 2. Componentes Implementados

### A. Dashboard Principal (`/v1/business/menu`)
**¿Qué es?**
Una pantalla central que sirve como centro de mando.
**¿Por qué se creó?**
Originalmente no existía una página en esta ruta, lo que causaba confusión al navegar. Se implementó para dar acceso rápido a las dos áreas principales y mostrar estadísticas (número de categorías y productos).

### B. Gestión de Categorías (`/v1/business/menu/categories`)
**Funcionalidad:**
- Permite crear nuevas secciones del menú (ej. "Pizzas", "Bebidas").
- Permite renombrar y eliminar categorías existentes.
- **Enlace Inteligente:** Se configuró el botón "Ver Productos" para redirigir al usuario al listado general de productos filtrado, en lugar de a una ruta dinámica vacía, mejorando la navegación.

** Backend (API):**
- `POST /api/v1/business/menu/categories`: Crea una nueva categoría en el archivo `menu.json`.
- `PUT/DELETE`: Rutas dinámicas para modificar o borrar categorías específicas.

### C. Gestión de Productos (`/v1/business/menu/products`)
**Funcionalidad:**
- **Listado Visual:** Muestra todos los productos con imagen, precio y estado.
- **Filtros:** Barra superior para cambiar rápidamente entre categorías.
- **Creación:** Modal interactivo que solicita primero la categoría y luego los detalles.
- **Edición:** Permite cambiar precios, descripciones, imágenes y disponibilidad.

**Corrección Importante:**
Durante la implementación, se detectó que los productos nuevos no se guardaban permanentemente. Se corrigió el archivo `route.ts` añadiendo la función `saveMenu()`, asegurando que cada nuevo producto se escriba correctamente en el disco.

## 3. Estructura de Datos (Persistencia)
Se utiliza un archivo JSON local (`data/menu.json`) para simular una base de datos.
- **Estructura:** Array de objetos "Categoría", donde cada categoría contiene un array de "Productos".
- **Ventaja:** Esta estructura jerárquica facilita la renderización del menú agrupado en la aplicación final del cliente.

## 4. Tecnologías Clave
- **Next.js API Routes:** Para el backend server-side.
- **React Hooks (useState, useEffect):** Para la gestión del estado en el frontend.
- **Lucide React:** Para los iconos de la interfaz.
- **Tailwind CSS:** Para el diseño responsivo y moderno.
