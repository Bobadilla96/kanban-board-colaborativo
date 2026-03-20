import {
  DEFAULT_LABELS,
  type Board,
  type Card,
  type Member,
  type Priority
} from '@/types/board.types';

let activityCounter = 0;

const day = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const createActivity = (action: string, user: Member) => ({
  id: `act-seed-${++activityCounter}`,
  userId: user.id,
  userName: user.name,
  action,
  timestamp: new Date().toISOString()
});

const createCard = (input: {
  id: string;
  title: string;
  description: string;
  assigneeId?: string | null;
  priority?: Priority;
  labels?: string[];
  dueDate?: string | null;
  checklist?: Array<{ text: string; completed: boolean }>;
  comments?: number;
  attachments?: number;
  author: Member;
}): Card => ({
  id: input.id,
  title: input.title,
  description: input.description,
  assigneeId: input.assigneeId ?? null,
  priority: input.priority ?? 'none',
  labels: DEFAULT_LABELS.filter((label) => input.labels?.includes(label.id)),
  dueDate: input.dueDate ?? null,
  checklist: (input.checklist ?? []).map((item, index) => ({
    id: `${input.id}-check-${index + 1}`,
    text: item.text,
    completed: item.completed
  })),
  attachments: input.attachments ?? 0,
  comments: input.comments ?? 0,
  activity: [
    createActivity('creo esta tarjeta', input.author),
    createActivity('actualizo descripcion y prioridad', input.author)
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const TEAM_MEMBERS: Member[] = [
  { id: 'u1', name: 'Ana Ruiz', avatar: 'AR', email: 'ana@kanban.local' },
  { id: 'u2', name: 'Carlos Gomez', avatar: 'CG', email: 'carlos@kanban.local' },
  { id: 'u3', name: 'Laura Benitez', avatar: 'LB', email: 'laura@kanban.local' },
  { id: 'u4', name: 'Diego Silva', avatar: 'DS', email: 'diego@kanban.local' },
  { id: 'u5', name: 'Marta Acosta', avatar: 'MA', email: 'marta@kanban.local' }
];

const [ana, carlos, laura, diego, marta] = TEAM_MEMBERS;

export const MOCK_BOARDS: Board[] = [
  {
    id: 'board-sprint-14',
    name: 'Sprint 14',
    description: 'Iteracion de desarrollo para mejoras de experiencia y estabilidad.',
    members: TEAM_MEMBERS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    columns: [
      {
        id: 'col-todo',
        title: 'Por hacer',
        order: 0,
        wipLimit: 6,
        cards: [
          createCard({
            id: 'sp14-1',
            title: 'Refactor de auth provider',
            description: 'Desacoplar manejo de sesion del modulo principal.',
            assigneeId: carlos.id,
            priority: 'high',
            labels: ['l6', 'l2'],
            dueDate: day(3),
            comments: 4,
            attachments: 1,
            checklist: [
              { text: 'Separar hooks', completed: true },
              { text: 'Agregar pruebas smoke', completed: false }
            ],
            author: ana
          }),
          createCard({
            id: 'sp14-2',
            title: 'Documentar API de pagos',
            description: 'Actualizar README tecnico y ejemplos de request.',
            assigneeId: marta.id,
            priority: 'medium',
            labels: ['l4'],
            dueDate: day(2),
            comments: 1,
            attachments: 0,
            author: laura
          }),
          createCard({
            id: 'sp14-3',
            title: 'Implementar lazy loading en dashboard',
            description: 'Reducir el TTI separando chunks de analytics.',
            assigneeId: diego.id,
            priority: 'urgent',
            labels: ['l7', 'l5'],
            dueDate: day(1),
            comments: 7,
            attachments: 2,
            author: carlos
          }),
          createCard({
            id: 'sp14-4',
            title: 'Wireframe para onboarding v2',
            description: 'Propuesta de flujo guiado para nuevos usuarios.',
            assigneeId: laura.id,
            priority: 'low',
            labels: ['l8'],
            dueDate: day(7),
            comments: 2,
            attachments: 4,
            author: marta
          }),
          createCard({
            id: 'sp14-5',
            title: 'Ajustar tokens de color accesible',
            description: 'Corregir contrastes AA en estados disabled y warning.',
            assigneeId: ana.id,
            priority: 'medium',
            labels: ['l3', 'l7'],
            dueDate: day(5),
            comments: 3,
            attachments: 1,
            author: laura
          }),
          createCard({
            id: 'sp14-6',
            title: 'Investigar error intermitente 502',
            description: 'Analizar logs del gateway en hora pico.',
            assigneeId: null,
            priority: 'high',
            labels: ['l1', 'l6'],
            dueDate: day(-1),
            comments: 6,
            attachments: 0,
            author: diego
          })
        ]
      },
      {
        id: 'col-in-progress',
        title: 'En progreso',
        order: 1,
        wipLimit: 4,
        cards: [
          createCard({
            id: 'sp14-7',
            title: 'Migracion de reporte mensual a nuevo endpoint',
            description: 'Consumir endpoint resumido y remover legacy mapper.',
            assigneeId: carlos.id,
            priority: 'high',
            labels: ['l6', 'l2'],
            dueDate: day(2),
            comments: 5,
            attachments: 1,
            author: ana
          }),
          createCard({
            id: 'sp14-8',
            title: 'Formulario de soporte con validacion progresiva',
            description: 'Mejorar UX y mensajes por campo.',
            assigneeId: ana.id,
            priority: 'medium',
            labels: ['l7', 'l3'],
            dueDate: day(4),
            comments: 2,
            attachments: 1,
            checklist: [
              { text: 'Reglas por campo', completed: true },
              { text: 'Mensajes inline', completed: true },
              { text: 'Prueba e2e', completed: false }
            ],
            author: diego
          }),
          createCard({
            id: 'sp14-9',
            title: 'Paginacion server-side en listado de clientes',
            description: 'Incluir filtros combinados y orden por fecha.',
            assigneeId: diego.id,
            priority: 'urgent',
            labels: ['l5', 'l7'],
            dueDate: day(-2),
            comments: 8,
            attachments: 3,
            author: carlos
          }),
          createCard({
            id: 'sp14-10',
            title: 'Normalizar errores en capa API',
            description: 'Mapear errores de negocio a mensajes consistentes.',
            assigneeId: marta.id,
            priority: 'medium',
            labels: ['l6', 'l4'],
            dueDate: day(6),
            comments: 3,
            attachments: 0,
            author: laura
          })
        ]
      },
      {
        id: 'col-review',
        title: 'En revision',
        order: 2,
        wipLimit: 3,
        cards: [
          createCard({
            id: 'sp14-11',
            title: 'Micro animaciones en cards del dashboard',
            description: 'Animaciones suaves para entrada y reordenamiento.',
            assigneeId: laura.id,
            priority: 'low',
            labels: ['l8', 'l7'],
            dueDate: day(1),
            comments: 2,
            attachments: 2,
            author: ana
          }),
          createCard({
            id: 'sp14-12',
            title: 'Auditoria de permisos por rol',
            description: 'Revisar matrix de acceso para admin/staff/viewer.',
            assigneeId: ana.id,
            priority: 'high',
            labels: ['l6', 'l1'],
            dueDate: day(2),
            comments: 5,
            attachments: 1,
            author: carlos
          })
        ]
      },
      {
        id: 'col-done',
        title: 'Hecho',
        order: 3,
        cards: [
          createCard({
            id: 'sp14-13',
            title: 'Dashboard KPI con filtros por periodo',
            description: 'Entrega inicial aprobada por producto.',
            assigneeId: diego.id,
            priority: 'medium',
            labels: ['l7'],
            dueDate: day(-3),
            comments: 4,
            attachments: 1,
            author: ana
          }),
          createCard({
            id: 'sp14-14',
            title: 'Pipeline CI con lint + test',
            description: 'Se agrego control de calidad automatico.',
            assigneeId: carlos.id,
            priority: 'high',
            labels: ['l6'],
            dueDate: day(-4),
            comments: 3,
            attachments: 0,
            author: carlos
          }),
          createCard({
            id: 'sp14-15',
            title: 'Plantilla de issue para bugs',
            description: 'Incluye campos de severidad y reproducibilidad.',
            assigneeId: marta.id,
            priority: 'low',
            labels: ['l4'],
            dueDate: day(-5),
            comments: 1,
            attachments: 0,
            author: marta
          }),
          createCard({
            id: 'sp14-16',
            title: 'Optimizar consulta de resumen diario',
            description: 'Se redujo tiempo de respuesta un 40%.',
            assigneeId: ana.id,
            priority: 'high',
            labels: ['l6', 'l3'],
            dueDate: day(-6),
            comments: 6,
            attachments: 2,
            author: diego
          }),
          createCard({
            id: 'sp14-17',
            title: 'Fix en timezone para reportes',
            description: 'Correccion de desfase para usuarios de LATAM.',
            assigneeId: laura.id,
            priority: 'urgent',
            labels: ['l1', 'l5'],
            dueDate: day(-1),
            comments: 5,
            attachments: 1,
            author: laura
          })
        ]
      }
    ]
  },
  {
    id: 'board-marketing-q1',
    name: 'Marketing Q1',
    description: 'Plan de contenidos y campañas para captacion del primer trimestre.',
    members: TEAM_MEMBERS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    columns: [
      {
        id: 'mk-ideas',
        title: 'Ideas',
        order: 0,
        cards: [
          createCard({
            id: 'mk-1',
            title: 'Serie de videos cortos de producto',
            description: 'Publicacion semanal en redes profesionales.',
            assigneeId: marta.id,
            priority: 'medium',
            labels: ['l2', 'l8'],
            dueDate: day(8),
            comments: 2,
            attachments: 2,
            author: marta
          }),
          createCard({
            id: 'mk-2',
            title: 'Campana de referidos para clientes activos',
            description: 'Oferta con beneficio para ambas partes.',
            assigneeId: null,
            priority: 'high',
            labels: ['l2', 'l5'],
            dueDate: day(6),
            comments: 4,
            attachments: 1,
            author: ana
          }),
          createCard({
            id: 'mk-3',
            title: 'Landing para webinar tecnico',
            description: 'Registro y lead scoring con automatizacion.',
            assigneeId: laura.id,
            priority: 'medium',
            labels: ['l7', 'l3'],
            dueDate: day(5),
            comments: 3,
            attachments: 2,
            author: carlos
          }),
          createCard({
            id: 'mk-4',
            title: 'Calendario editorial del blog',
            description: 'Temas por vertical y CTA por etapa.',
            assigneeId: diego.id,
            priority: 'low',
            labels: ['l4'],
            dueDate: day(10),
            comments: 1,
            attachments: 0,
            author: laura
          }),
          createCard({
            id: 'mk-5',
            title: 'Newsletter mensual para comunidad',
            description: 'Resumen de novedades y casos de exito.',
            assigneeId: carlos.id,
            priority: 'medium',
            labels: ['l2', 'l4'],
            dueDate: day(9),
            comments: 2,
            attachments: 1,
            author: marta
          })
        ]
      },
      {
        id: 'mk-execution',
        title: 'En ejecucion',
        order: 1,
        wipLimit: 5,
        cards: [
          createCard({
            id: 'mk-6',
            title: 'A/B testing en formulario demo',
            description: 'Version corta vs larga para mejorar conversion.',
            assigneeId: ana.id,
            priority: 'high',
            labels: ['l7', 'l3'],
            dueDate: day(3),
            comments: 3,
            attachments: 1,
            author: carlos
          }),
          createCard({
            id: 'mk-7',
            title: 'Campana paid search marca',
            description: 'Ajuste de grupos de anuncios y extensiones.',
            assigneeId: diego.id,
            priority: 'urgent',
            labels: ['l5'],
            dueDate: day(2),
            comments: 7,
            attachments: 3,
            author: marta
          }),
          createCard({
            id: 'mk-8',
            title: 'Kit visual para redes',
            description: 'Plantillas para posts de novedades y soporte.',
            assigneeId: laura.id,
            priority: 'medium',
            labels: ['l8'],
            dueDate: day(4),
            comments: 2,
            attachments: 4,
            author: laura
          }),
          createCard({
            id: 'mk-9',
            title: 'Segmentacion de base para email',
            description: 'Separar por industria y nivel de madurez.',
            assigneeId: carlos.id,
            priority: 'medium',
            labels: ['l4', 'l6'],
            dueDate: day(-1),
            comments: 3,
            attachments: 0,
            author: ana
          }),
          createCard({
            id: 'mk-10',
            title: 'Seguimiento de MQL a SQL',
            description: 'Definir handoff con equipo comercial.',
            assigneeId: marta.id,
            priority: 'high',
            labels: ['l2', 'l6'],
            dueDate: day(1),
            comments: 5,
            attachments: 1,
            author: diego
          })
        ]
      },
      {
        id: 'mk-done',
        title: 'Completado',
        order: 2,
        cards: [
          createCard({
            id: 'mk-11',
            title: 'Benchmark de competidores',
            description: 'Matriz de posicionamiento y propuesta de valor.',
            assigneeId: laura.id,
            priority: 'low',
            labels: ['l4'],
            dueDate: day(-8),
            comments: 1,
            attachments: 1,
            author: laura
          }),
          createCard({
            id: 'mk-12',
            title: 'Definicion de buyer personas',
            description: 'Tres segmentos principales con pains y goals.',
            assigneeId: ana.id,
            priority: 'high',
            labels: ['l3'],
            dueDate: day(-7),
            comments: 2,
            attachments: 2,
            author: marta
          }),
          createCard({
            id: 'mk-13',
            title: 'Checklist de lanzamiento de campanas',
            description: 'Procedimiento para revision previa.',
            assigneeId: diego.id,
            priority: 'medium',
            labels: ['l4', 'l3'],
            dueDate: day(-4),
            comments: 4,
            attachments: 1,
            author: carlos
          }),
          createCard({
            id: 'mk-14',
            title: 'Plantilla de reporte semanal',
            description: 'Dashboard y resumen ejecutivo para stakeholders.',
            assigneeId: carlos.id,
            priority: 'medium',
            labels: ['l6', 'l4'],
            dueDate: day(-3),
            comments: 3,
            attachments: 0,
            author: ana
          }),
          createCard({
            id: 'mk-15',
            title: 'Alineacion editorial con equipo de producto',
            description: 'Calendario conjunto para lanzamientos Q1.',
            assigneeId: marta.id,
            priority: 'high',
            labels: ['l2', 'l8'],
            dueDate: day(-2),
            comments: 5,
            attachments: 2,
            author: laura
          })
        ]
      }
    ]
  }
];
