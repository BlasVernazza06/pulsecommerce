# ⚡ PulseCommerce

> **Tier-1 Point of Sale (POS) & Autonomous Retail Operating System**  
> Diseñado para operaciones comerciales de alta velocidad, resiliencia *Offline-First*, integración de hardware físico y orquestación multimodal con IA supervisada (*Human-in-the-Loop*).

---

## 🏛️ Visión Arquitectónica & Propósito

**PulseCommerce** es una plataforma operativa integral de punto de venta (POS) y gestión comercial empresarial. Combina un motor de facturación ultrarrápido operado al 100% por teclado, persistencia local reactiva para tolerancia total a caídas de red, arquitectura orientada a eventos (**CQRS**), servidor **Model Context Protocol (MCP)** y agentes inteligentes con **Generative UI** para automatización de inventario y compras.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PulseCommerce Ecosystem                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
         ┌────────────────────────────┴────────────────────────────┐
         ▼                                                         ▼
┌──────────────────────────────────┐             ┌──────────────────────────────────┐
│         Terminal Web POS         │             │           Backend API            │
│       Next.js 15 (React 19)      │◄──WebSockets──►│          NestJS (CQRS)           │
│  Dexie.js (Outbox) + Tailwind/UI │             │  Drizzle ORM + PostgreSQL 16     │
└──────────────────────────────────┘             └──────────────────────────────────┘
         │                                                         │
   Dual Hardware                                             Async Workers
 (HID Scanner / ESC-POS)                                   (Redis / BullMQ)
         │                                                         │
         ▼                                                         ▼
┌──────────────────────────────────┐             ┌──────────────────────────────────┐
│      Voice POS & Multimodal      │             │        MCP Server Protocol       │
│  Whisper + Vercel AI SDK + HITL  │             │   Herramientas estandarizadas    │
└──────────────────────────────────┘             └──────────────────────────────────┘
```

---

## 🚀 Módulos Core del Sistema

### 1. Terminal POS Ultrarrápido (Caja de Alta Velocidad)
- **Operación 100% por Teclado**: Diseñado para cajeros de alta rotación (`F2` Buscar productos, `F4` Cobrar/Finalizar, `Espacio` Escaneo rápido, `Ctrl+K` Command Palette, navegación ordinal y `Enter`).
- **Escaneo Dual de Código de Barras**:
  - *Pistolas Láser / Bluetooth (HID)*: Interrupción de buffer de teclado en `< 50ms`.
  - *Cámara Integrada*: BarcodeDetector API nativa con fallback WebAssembly.
- **Múltiples Medios de Pago**: Efectivo con cálculo instantáneo de cambio, tarjetas (débito/crédito), QR interoperable y cuenta corriente (fiado).
- **Impresión Térmica**: Impresión directa de tickets y comandas bajo protocolo ESC/POS vía WebUSB o Daemon local.

### 2. Arquitectura Offline-First & Resiliencia
- **Persistencia en Borde**: Catálogo local y cola de transacciones gestionadas con **Dexie.js (IndexedDB)**.
- **Outbox Pattern**: Las ventas se consolidan localmente en `< 20ms` y se sincronizan bidireccionalmente hacia el backend mediante un worker de sincronización transaccional con UUID v7 e idempotencia estricta.

### 3. Asistente Conversacional & Voice POS
- **Voice-to-Action**: Comandos de voz en lenguaje natural (*"Cobrame dos gaseosas y un paquete de galletitas en efectivo"*).
- **Generative UI con HITL (*Human-in-the-Loop*)**: Renderizado en vivo de widgets interactivos (gráficos Recharts, tablas editables y modales de confirmación). **Ninguna acción destructiva o financiera muta la base de datos sin confirmación visual previa**.

### 4. Inventario Multidepósito & OCR Multimodal
- **Trazabilidad en Tiempo Real**: Control de existencias por sucursal, lote y fecha de caducidad con puntos de reorden automáticos.
- **Ingesta Inteligente de Facturas**: Extracción estructurada (visión multimodal $\to$ Zod) de remitos y facturas de proveedores con conciliación automática de costos.

### 5. Control de Tesorería & Arqueo
- **Cierres Ciegos (*Blind Close*)**: Turnos de caja, adición y retiro parcial de efectivo, conciliación automática y detección de discrepancias.

---

## 📊 Service Level Objectives (SLOs)

| Métrica | Objetivo | Implementación |
| :--- | :--- | :--- |
| **Latencia de Escaneo** | `< 50 ms` | Buffer HID + Indexación IndexedDB |
| **Commit de Venta (Command Path)** | `< 20 ms` | Commit local Outbox en Dexie.js |
| **Latencia Voice-to-Action** | `< 1.2 s` | Whisper + Inferencia Streaming Vercel AI SDK |
| **Disponibilidad en Caja** | **99.99%** | Local-First / Sincronización asíncrona |
| **Consistencia Transaccional** | Estricta | UUID v7, Outbox Pattern, Idempotency Keys |

---

## 🏗️ Estructura del Monorepo

Este repositorio utiliza **Turborepo** y **pnpm workspaces**:

```text
pulsecommerce/
├── apps/
│   ├── web/                    # Next.js 15 (POS Terminal Local-First + Admin UI)
│   └── api/                    # NestJS (CQRS, WebSockets, MCP Server)
├── packages/
│   ├── contracts/              # Esquemas Zod compartidos (DTOs, Eventos, Tools)
│   ├── db/                     # Drizzle ORM (Schema PostgreSQL 16 + Migraciones)
│   ├── ui/                     # Componentes y Primitivas de Diseño (Shadcn / Tailwind)
│   ├── typescript-config/      # Configuraciones base de TypeScript (tsconfig)
│   └── eslint-config/          # Reglas estandarizadas de linter
├── docker-compose.yml          # Infraestructura local (PostgreSQL 16 + Redis)
├── turbo.json                  # Pipelines de compilación y caché de Turborepo
└── package.json                # Scripts y dependencias raíz
```

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn/UI (Radix UI), Framer Motion, Recharts, Dexie.js.
- **Backend**: NestJS 10, `@nestjs/cqrs`, WebSockets Gateway, Model Context Protocol (MCP) Server.
- **Capa de Datos**: PostgreSQL 16, **Drizzle ORM**, Drizzle Kit.
- **Colas & Mensajería**: Redis, BullMQ / Redis Streams.
- **IA & Multimodal**: Vercel AI SDK (`ai`), OpenAI / Gemini Flash, Whisper, Zod.
- **Monorepo Tooling**: Turborepo, pnpm 9.

---

## ⚙️ Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas:

- **Node.js**: `>= 20.x`
- **pnpm**: `>= 9.x` (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker & Docker Compose**: Para levantar PostgreSQL y Redis locales.

---

## 🚀 Puesta en Marcha (Entorno de Desarrollo)

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/BlasVernazza06/pulsecommerce.git
cd pulsecommerce
pnpm install
```

### 2. Iniciar Servicios de Infraestructura (Docker)
Levanta los contenedores de PostgreSQL 16 y Redis:
```bash
pnpm docker:up
```

### 3. Configurar Variables de Entorno
Copia los archivos de ejemplo en cada servicio:
```bash
# Backend (apps/api)
cp apps/api/.env.example apps/api/.env

# Base de datos (packages/db)
cp packages/db/.env.example packages/db/.env

# Frontend (apps/web)
cp apps/web/.env.example apps/web/.env.local
```

### 4. Ejecutar Migraciones de Base de Datos
Genera y aplica los esquemas de Drizzle ORM en PostgreSQL:
```bash
pnpm db:push
# O para migraciones versionadas:
pnpm db:migrate
```

### 5. Iniciar Servidores de Desarrollo
Ejecuta todos los servicios y aplicaciones concurrentemente con Turborepo:
```bash
pnpm dev
```

Los servicios estarán disponibles en:
- 🖥️ **POS Terminal & Admin Web**: `http://localhost:3000`
- ⚡ **Backend API & WebSockets**: `http://localhost:4000`
- 🗄️ **Drizzle Studio (Explorador DB)**: `pnpm db:studio` $\to$ `https://local.drizzle.studio`

---

## 📜 Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia todos los proyectos en modo desarrollo con Hot-Reload |
| `pnpm build` | Compila todas las aplicaciones y paquetes del monorepo |
| `pnpm lint` | Ejecuta ESLint a través de todos los workspaces |
| `pnpm check-types` | Valida el tipado estático con TypeScript en todo el monorepo |
| `pnpm format` | Formatea el código con Prettier |
| `pnpm db:push` | Sincroniza directamente el schema de Drizzle con la base de datos |
| `pnpm db:migrate` | Ejecuta las migraciones SQL pendientes |
| `pnpm db:generate` | Genera nuevas migraciones SQL basadas en el schema TypeScript |
| `pnpm db:studio` | Abre el panel visual Drizzle Studio |
| `pnpm docker:up` | Levanta los contenedores de PostgreSQL y Redis en background |
| `pnpm docker:down` | Detiene los contenedores locales de Docker |
| `pnpm docker:logs` | Visualiza los logs en tiempo real de Docker |

---

## 🛡️ Principios de Arquitectura & Calidad

1. **Tipado Estricto de Extremo a Extremo**: Los contratos y esquemas Zod en `@pulsecommerce/contracts` gobiernan los DTOs de entrada/salida de la API, las herramientas de IA y la validación en el cliente. Cero tipos `any`.
2. **Human-in-the-Loop Obligatorio**: Ningún agente inteligente tiene permisos para mutar stock, listas de precios o emitir pagos sin presentar un preview/draft que requiera aprobación explícita del usuario.
3. **Desacoplamiento CQRS & Async Queues**: El flujo de cobro prioritario procesa únicamente la persistencia y emite eventos de dominio; fiscalización, sincronizaciones y reportes pesados se delegan a colas en Redis.
4. **Idempotencia y Trazabilidad**: Todo comando de cobro porta un UUID v7 y clave de idempotencia para prevenir duplicaciones ante reintentos de red.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
