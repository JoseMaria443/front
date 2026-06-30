
## Requisitos Previos

1. **Git**: Para control de versiones.
2. **Node.js**: Versión 20.x (LTS) o superior.

## Instalación y Ejecución

Sigue estos pasos para levantar el entorno de desarrollo:

1. **Clonar el repositorio**:
   ```bash
   git clone <url del repo>
   cd sgc2if
Instalar dependencias:
Esto instalará las librerías base y las dependencias estructurales requeridas (Zustand, Zod, Lucide React).

Bash
npm install
Iniciar el servidor local:

Bash
npm run dev
Ruta de acceso inicial para pruebas: http://localhost:3000/login

Estructura del Proyecto
La arquitectura mantiene una estricta separación de responsabilidades. Todos los directorios principales se encuentran directamente en la raíz (no se utiliza una carpeta src):

/app: Enrutador de Next.js y agrupación de vistas ((auth), (dashboard)).

/components/ui: Componentes visuales atómicos y reutilizables (Botones, Inputs, Badges).

/components/layout: Estructura visual global (Sidebar, Topbar).

/models: Esquemas de validación y tipado estricto definidos con Zod.

/services: Capa de abstracción encargada de interactuar con el backend o datos simulados (Mocks).

/store: Manejadores de estado global utilizando Zustand.

/public: Archivos estáticos y recursos gráficos (SVGs).

Reglas Estrictas de Desarrollo
Cero lógica de datos en vistas: Todo consumo de información o peticiones (fetch) debe aislarse en la carpeta /services. Está prohibido realizar peticiones directas desde los componentes en /app.

Uso de componentes UI: Se deben utilizar estrictamente los componentes base de /components/ui para garantizar la consistencia visual del sistema.

Gestión de estado global: Utilizar Zustand en la carpeta /store para datos compartidos entre múltiples vistas (ej. sesión de usuario), evitando pasar props innecesariamente por varias capas (prop drilling).