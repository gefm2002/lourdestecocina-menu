import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { InstitutionalMenu, InstitutionalOrderSelection } from "../types";
import { formatPrice } from "../utils/format";
import {
  formatLongDate,
  formatShortDate,
  getActiveMenus,
  getMenuCalendar,
  getUpcomingMenus,
  INSTITUTION_TYPE_PUBLIC_LABELS,
  MENU_CYCLE_LABELS,
  USER_STATUS_LABELS,
} from "../utils/institutional";
import { useData } from "../utils/data";
import { buildInstitutionalOrderMessage, buildWhatsAppLink } from "../utils/whatsapp";

type DraftSelectionMap = Record<string, Record<string, InstitutionalOrderSelection>>;
type PortalModal = "register" | "login" | "groups" | null;

const emptyRegister = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  institutionId: "",
  username: "",
  password: "",
};

const emptyLogin = {
  usernameOrEmail: "",
  password: "",
};

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Pedí acceso",
    body: "Completás un formulario con tus datos y el grupo al que pertenés (escuela, empresa, familia, etc.).",
  },
  {
    step: "2",
    title: "Te damos el OK",
    body: "Lourdes revisa y aprueba tu cuenta. Hasta entonces no podés armar pedidos del menú cerrado.",
  },
  {
    step: "3",
    title: "Elegís y mandás por WhatsApp",
    body: "Con la cuenta activa, marcás las opciones del día, se guarda tu pedido y lo enviás como comanda por WhatsApp.",
  },
] as const;

const daySlotKey = (date: string, sectionId: string) => `${date}::${sectionId}`;

function ChevronIcon({ expanded, className }: { expanded: boolean; className?: string }) {
  return (
    <svg
      className={`shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""} ${className ?? ""}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PortalModalFrame(props: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { open, title, onClose, children } = props;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Cerrar ventana"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col rounded-t-2xl border border-black/10 bg-white shadow-xl sm:max-h-[85vh] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-modal-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-5 py-4">
          <h2 id="portal-modal-title" className="font-display text-lg font-semibold text-primary">
            {title}
          </h2>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-muted transition hover:bg-black/5"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export const InstitutionalPortalPage = () => {
  const {
    site,
    institutions,
    institutionUsers,
    institutionalMenus,
    institutionalOrders,
    currentPortalUser,
    registerInstitutionalUser,
    loginInstitutionalUser,
    logoutInstitutionalUser,
    createInstitutionalOrder,
  } = useData();
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [flash, setFlash] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [draftSelections, setDraftSelections] = useState<DraftSelectionMap>({});
  const [modal, setModal] = useState<PortalModal>(null);
  const [expandedDayDates, setExpandedDayDates] = useState<Set<string>>(() => new Set());
  /**
   * Sección abierta por día (id). Clave ausente = abrir la primera por defecto.
   * Valor "" = el usuario cerró todo a propósito.
   */
  const [openSectionByDay, setOpenSectionByDay] = useState<Record<string, string>>({});

  const activeInstitutions = institutions.filter((institution) => institution.isActive);
  const currentInstitution = currentPortalUser
    ? institutions.find((institution) => institution.id === currentPortalUser.institutionId) ?? null
    : null;

  const activeMenus = useMemo(
    () =>
      currentPortalUser ? getActiveMenus(institutionalMenus, currentPortalUser.institutionId) : [],
    [currentPortalUser, institutionalMenus]
  );
  const upcomingMenus = useMemo(
    () =>
      currentPortalUser ? getUpcomingMenus(institutionalMenus, currentPortalUser.institutionId) : [],
    [currentPortalUser, institutionalMenus]
  );

  const selectedMenu =
    activeMenus.find((menu) => menu.id === selectedMenuId) ?? activeMenus[0] ?? null;
  const calendar = selectedMenu ? getMenuCalendar(selectedMenu) : [];
  const currentMenuSelections = selectedMenu ? draftSelections[selectedMenu.id] ?? {} : {};
  const currentSelections = Object.values(currentMenuSelections).sort((a, b) =>
    `${a.date}-${a.sectionName}`.localeCompare(`${b.date}-${b.sectionName}`)
  );
  const currentTotal = currentSelections.reduce((acc, selection) => acc + selection.unitPrice, 0);

  useEffect(() => {
    if (!selectedMenu) return;
    const days = getMenuCalendar(selectedMenu);
    if (days.length === 0) return;
    setExpandedDayDates(new Set([days[0].date]));
    setOpenSectionByDay({});
  }, [selectedMenu?.id]);

  const toggleDayPanel = (date: string) => {
    setExpandedDayDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const openDayAndScroll = (date: string) => {
    setExpandedDayDates((prev) => new Set(prev).add(date));
    requestAnimationFrame(() => {
      document.getElementById(`inst-day-${date}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const expandAllDays = () => {
    if (!selectedMenu) return;
    setExpandedDayDates(new Set(getMenuCalendar(selectedMenu).map((d) => d.date)));
  };

  const collapseToFirstDay = () => {
    if (!selectedMenu) return;
    const days = getMenuCalendar(selectedMenu);
    if (days.length) setExpandedDayDates(new Set([days[0].date]));
  };

  const myOrders = useMemo(
    () =>
      currentPortalUser
        ? institutionalOrders
            .filter((order) => order.userId === currentPortalUser.id)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : [],
    [currentPortalUser, institutionalOrders]
  );

  const demoApprovedUsers = institutionUsers.filter((user) => user.status === "approved").slice(0, 2);
  const isDev = import.meta.env.DEV;

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterError("");
    setFlash("");
    const result = registerInstitutionalUser(registerForm);
    if (!result.ok) {
      setRegisterError(result.error);
      return;
    }
    setRegisterForm(emptyRegister);
    setFlash("Listo. Tu solicitud quedó pendiente: cuando Lourdes apruebe tu cuenta vas a poder armar pedidos.");
    setModal(null);
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    setFlash("");
    const result = loginInstitutionalUser(loginForm.usernameOrEmail, loginForm.password);
    if (!result.ok) {
      setLoginError(result.error);
      return;
    }
    setLoginForm(emptyLogin);
    setModal(null);
  };

  const handleSelectOption = (
    menu: InstitutionalMenu,
    selection: InstitutionalOrderSelection,
    slotKey: string
  ) => {
    setDraftSelections((prev) => ({
      ...prev,
      [menu.id]: {
        ...(prev[menu.id] ?? {}),
        [slotKey]: selection,
      },
    }));
  };

  const handleSubmitOrder = () => {
    if (!selectedMenu || !currentInstitution || !currentPortalUser) return;
    const result = createInstitutionalOrder({
      menuId: selectedMenu.id,
      institutionId: currentInstitution.id,
      selections: currentSelections,
    });
    if (!result.ok) {
      setFlash(result.error);
      return;
    }

    const message = buildInstitutionalOrderMessage({
      order: result.order,
      institution: currentInstitution,
      user: currentPortalUser,
    });

    setDraftSelections((prev) => ({
      ...prev,
      [selectedMenu.id]: {},
    }));
    setFlash(`Pedido ${result.order.id} guardado. Se abre WhatsApp con el resumen para confirmar.`);
    window.open(buildWhatsAppLink(site.contact.whatsapp, message), "_blank");
  };

  return (
    <main className="space-y-12 pb-20">
      {flash && (
        <div className="mx-auto max-w-6xl px-4 pt-6 lg:px-8">
          <div className="rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm text-primary">
            {flash}
          </div>
        </div>
      )}

      {!currentPortalUser && (
        <>
          <section className="relative overflow-hidden px-4 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-10 rounded-ui bg-white/80 px-5 py-12 shadow-sm ring-1 ring-black/5 lg:px-10 lg:py-14">
              <div className="max-w-3xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                  Viandas y menús por grupo
                </p>
                <h1 className="font-display text-3xl font-semibold leading-tight text-primary sm:text-4xl lg:text-[2.35rem]">
                  Para quienes encargamos menú cerrado: escuelas, empresas o grupos
                </h1>
                <p className="text-base leading-relaxed text-muted">
                  El menú del día y la carta no piden registro: pedís por{" "}
                  <a href={`https://wa.me/${site.contact.whatsapp}`} className="font-medium text-accent underline-offset-2 hover:underline">
                    WhatsApp
                  </a>{" "}
                  como siempre. Esta sección es solo si tu colegio, trabajo o grupo tiene un menú acordado
                  día por día: pedís acceso una vez, Lourdes lo aprueba, y después armás el pedido y lo
                  mandás por WhatsApp como comanda.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {PROCESS_STEPS.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-black/10 bg-soft/50 p-5 transition hover:border-primary/20"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {item.step}
                    </span>
                    <h2 className="mt-3 font-display text-lg font-semibold text-primary">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  onClick={() => {
                    setRegisterError("");
                    setModal("register");
                  }}
                >
                  Solicitar acceso
                </button>
                <button
                  type="button"
                  className="rounded-full border-2 border-primary bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                  onClick={() => {
                    setLoginError("");
                    setModal("login");
                  }}
                >
                  Ya tengo cuenta
                </button>
                <button
                  type="button"
                  className="text-sm font-medium text-muted underline-offset-2 hover:text-primary hover:underline"
                  onClick={() => setModal("groups")}
                >
                  Ver grupos con convenio
                </button>
              </div>

              <p className="text-sm text-muted">
                ¿Solo querés pedir sin menú cerrado?{" "}
                <Link to="/" className="font-medium text-accent underline-offset-2 hover:underline">
                  Ir al menú medio día
                </Link>
                {" · "}
                <Link to="/nocturno" className="font-medium text-accent underline-offset-2 hover:underline">
                  Carta nocturna
                </Link>
              </p>

              {isDev && (
                <div className="rounded-2xl border border-dashed border-amber-400/60 bg-amber-50/80 p-4 text-xs text-amber-950">
                  <p className="font-semibold text-amber-900">Solo en desarrollo</p>
                  <p className="mt-1 text-amber-900/90">
                    Instituciones activas: {activeInstitutions.length} · Menús planificados:{" "}
                    {institutionalMenus.length} · Órdenes de prueba: {institutionalOrders.length}
                  </p>
                  {demoApprovedUsers.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {demoApprovedUsers.map((user) => {
                        const institution = institutions.find((item) => item.id === user.institutionId);
                        return (
                          <li key={user.id} className="rounded-lg bg-white/80 px-3 py-2">
                            <span className="font-medium">{user.username}</span> / {user.password} ·{" "}
                            {institution?.name}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </section>

          <PortalModalFrame
            open={modal === "register"}
            title="Solicitar acceso"
            onClose={() => setModal(null)}
          >
            <p className="mb-5 text-sm text-muted">
              Completá los datos. Cuando Lourdes apruebe tu cuenta vas a poder ingresar y armar pedidos del menú
              activo de tu grupo.
            </p>
            <form className="space-y-3" onSubmit={handleRegister}>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-xl border border-black/10 px-4 py-2.5 text-sm"
                  placeholder="Nombre"
                  value={registerForm.firstName}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                  required
                />
                <input
                  className="rounded-xl border border-black/10 px-4 py-2.5 text-sm"
                  placeholder="Apellido"
                  value={registerForm.lastName}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-xl border border-black/10 px-4 py-2.5 text-sm"
                  placeholder="Email"
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
                <input
                  className="rounded-xl border border-black/10 px-4 py-2.5 text-sm"
                  placeholder="Teléfono"
                  value={registerForm.phone}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-primary">Grupo u organización</label>
                <select
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm"
                  value={registerForm.institutionId}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, institutionId: event.target.value }))
                  }
                  required
                >
                  <option value="">Elegí escuela, empresa u organización</option>
                  {activeInstitutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name} · {INSTITUTION_TYPE_PUBLIC_LABELS[institution.type]}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-muted">
                  Si no aparece el tuyo, escribinos por WhatsApp y lo damos de alta.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-xl border border-black/10 px-4 py-2.5 text-sm"
                  placeholder="Usuario (para ingresar)"
                  value={registerForm.username}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, username: event.target.value }))
                  }
                  required
                />
                <input
                  className="rounded-xl border border-black/10 px-4 py-2.5 text-sm"
                  placeholder="Contraseña"
                  type="password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />
              </div>
              {registerError && <p className="text-sm text-accent">{registerError}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white"
              >
                Enviar solicitud
              </button>
            </form>
          </PortalModalFrame>

          <PortalModalFrame open={modal === "login"} title="Ingresar" onClose={() => setModal(null)}>
            <p className="mb-5 text-sm text-muted">
              Usuario o email y contraseña. Solo las cuentas aprobadas ven el menú para armar el pedido.
            </p>
            <form className="space-y-3" onSubmit={handleLogin}>
              <input
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm"
                placeholder="Usuario o email"
                value={loginForm.usernameOrEmail}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, usernameOrEmail: event.target.value }))
                }
                required
              />
              <input
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm"
                placeholder="Contraseña"
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
              {loginError && <p className="text-sm text-accent">{loginError}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white"
              >
                Entrar
              </button>
            </form>
          </PortalModalFrame>

          <PortalModalFrame
            open={modal === "groups"}
            title="Grupos con convenio"
            onClose={() => setModal(null)}
          >
            <p className="mb-4 text-sm text-muted">
              Estas organizaciones tienen menú cerrado configurado. Si la tuya no está, contactanos por
              WhatsApp.
            </p>
            <ul className="space-y-3">
              {activeInstitutions.map((institution) => (
                <li
                  key={institution.id}
                  className="rounded-xl border border-black/10 bg-soft/30 px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-primary">{institution.name}</p>
                      <p className="text-xs text-muted">{institution.address}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-black/10 bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                      {INSTITUTION_TYPE_PUBLIC_LABELS[institution.type]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </PortalModalFrame>
        </>
      )}

      {currentPortalUser && (
        <section className="mx-auto max-w-6xl space-y-6 px-4 lg:px-8">
          <div className="rounded-ui border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Tu cuenta</p>
                <h2 className="font-display text-2xl font-semibold text-primary sm:text-3xl">
                  {currentPortalUser.firstName} {currentPortalUser.lastName}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {currentInstitution?.name} · {USER_STATUS_LABELS[currentPortalUser.status]}
                </p>
              </div>
              <button
                type="button"
                className="self-start rounded-full border border-black/10 px-4 py-2 text-sm text-muted transition hover:bg-black/5"
                onClick={logoutInstitutionalUser}
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          {currentPortalUser.status !== "approved" && (
            <div className="rounded-ui border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold text-primary">Cuenta pendiente de aprobación</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Cuando Lourdes apruebe tu acceso vas a ver el menú vigente de tu grupo, podrás elegir las
                opciones de cada día y generar el pedido que se guarda y se envía por WhatsApp.
              </p>
              {currentPortalUser.status === "rejected" && (
                <p className="mt-3 text-sm text-accent">
                  Esta solicitud no fue aprobada. Escribinos por WhatsApp si necesitás ayuda.
                </p>
              )}
            </div>
          )}

          {currentPortalUser.status === "approved" && (
            <>
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-ui border border-black/10 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-primary sm:text-2xl">
                        Armá tu pedido del período
                      </h3>
                      <p className="text-sm text-muted">
                        Abrí cada día y, dentro, cada categoría. Así la lista no se hace interminable.
                      </p>
                    </div>
                    {activeMenus.length > 1 && (
                      <select
                        className="rounded-full border border-black/10 px-4 py-2 text-sm"
                        value={selectedMenu?.id ?? ""}
                        onChange={(event) => setSelectedMenuId(event.target.value)}
                      >
                        {activeMenus.map((menu) => (
                          <option key={menu.id} value={menu.id}>
                            {menu.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {selectedMenu ? (
                    <div className="mt-5 space-y-5">
                      <div className="rounded-2xl border border-black/10 bg-soft/40 px-4 py-3">
                        <p className="text-sm font-semibold text-primary">{selectedMenu.name}</p>
                        <p className="text-xs text-muted">
                          {MENU_CYCLE_LABELS[selectedMenu.cycle]} · Del {formatLongDate(selectedMenu.startDate)} al{" "}
                          {formatLongDate(selectedMenu.endDate)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Saltar al día</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                            onClick={expandAllDays}
                          >
                            Abrir todos los días
                          </button>
                          <span className="text-muted">·</span>
                          <button
                            type="button"
                            className="text-xs font-medium text-muted underline-offset-2 hover:text-primary hover:underline"
                            onClick={collapseToFirstDay}
                          >
                            Dejar solo el primero abierto
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {calendar.map((day) => {
                          const totalSections = day.sections.length;
                          const doneSections = day.sections.filter(
                            (s) => !!currentMenuSelections[daySlotKey(day.date, s.id)]
                          ).length;
                          const isComplete = totalSections > 0 && doneSections === totalSections;
                          const isOpen = expandedDayDates.has(day.date);
                          return (
                            <button
                              key={day.date}
                              type="button"
                              onClick={() => openDayAndScroll(day.date)}
                              className={`shrink-0 rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition ${
                                isOpen
                                  ? "border-primary bg-primary text-white shadow-sm"
                                  : isComplete
                                    ? "border-accent/40 bg-accent/10 text-primary"
                                    : "border-black/10 bg-white text-primary hover:border-primary/30"
                              }`}
                            >
                              <span className="block">{day.label}</span>
                              <span className={`block text-[10px] font-normal ${isOpen ? "text-white/85" : "text-muted"}`}>
                                {isComplete ? "Listo ✓" : `${doneSections}/${totalSections}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="space-y-3">
                        {calendar.map((day) => {
                          const totalSections = day.sections.length;
                          const doneSections = day.sections.filter(
                            (s) => !!currentMenuSelections[daySlotKey(day.date, s.id)]
                          ).length;
                          const isOpen = expandedDayDates.has(day.date);
                          const preview = day.sections
                            .map((s) => {
                              const sel = currentMenuSelections[daySlotKey(day.date, s.id)];
                              return sel?.name ?? null;
                            })
                            .filter(Boolean)
                            .slice(0, 2)
                            .join(" · ");
                          const previewMore =
                            doneSections > 2 ? ` +${doneSections - 2}` : doneSections > 0 && !preview ? "…" : "";

                          return (
                            <div
                              key={day.date}
                              id={`inst-day-${day.date}`}
                              className="scroll-mt-28 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
                            >
                              <button
                                type="button"
                                onClick={() => toggleDayPanel(day.date)}
                                className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-soft/40"
                                aria-expanded={isOpen}
                              >
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-display text-base font-semibold text-primary">
                                      {day.label}
                                    </span>
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                        doneSections === totalSections && totalSections > 0
                                          ? "bg-accent/15 text-accent"
                                          : "bg-black/5 text-muted"
                                      }`}
                                    >
                                      {doneSections}/{totalSections}
                                    </span>
                                  </div>
                                  <span className="text-xs text-muted">{formatLongDate(day.date)}</span>
                                  {!isOpen && (
                                    <span className="line-clamp-2 text-xs text-muted">
                                      {preview || previewMore
                                        ? `${preview}${previewMore}`
                                        : "Tocá para elegir plato, postre y bebida"}
                                    </span>
                                  )}
                                </div>
                                <ChevronIcon expanded={isOpen} className="text-primary" />
                              </button>

                              {isOpen && (
                                <div className="space-y-2 border-t border-black/10 bg-soft/20 px-3 py-4">
                                  {(() => {
                                    const stored = openSectionByDay[day.date];
                                    const openSectionIdForDay =
                                      stored === undefined
                                        ? (day.sections[0]?.id ?? null)
                                        : stored === ""
                                          ? null
                                          : stored;
                                    return day.sections.map((section) => {
                                      const slotKey = daySlotKey(day.date, section.id);
                                      const currentSelection = currentMenuSelections[slotKey];
                                      const isSectionOpen = openSectionIdForDay === section.id;

                                      return (
                                        <details
                                          key={section.id}
                                          className="group rounded-xl border border-black/10 bg-white open:shadow-sm"
                                          open={isSectionOpen}
                                          onToggle={(event) => {
                                            const el = event.currentTarget;
                                            setOpenSectionByDay((prev) => ({
                                              ...prev,
                                              [day.date]: el.open ? section.id : "",
                                            }));
                                          }}
                                        >
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 [&::-webkit-details-marker]:hidden">
                                          <div className="min-w-0 text-left">
                                            <p className="text-sm font-semibold text-primary">{section.name}</p>
                                            <p className="text-xs text-muted">Elegí 1 de {section.options.length}</p>
                                          </div>
                                          {currentSelection ? (
                                            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                              {currentSelection.name}
                                            </span>
                                          ) : (
                                            <span className="shrink-0 text-xs text-accent">Elegir</span>
                                          )}
                                        </summary>
                                        <div className="border-t border-black/10 px-3 pb-4 pt-3">
                                          <div className="grid gap-2 sm:grid-cols-2">
                                            {section.options.map((option) => {
                                              const isSelected = currentSelection?.productId === option.productId;
                                              return (
                                                <button
                                                  key={option.id}
                                                  type="button"
                                                  className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                                                    isSelected
                                                      ? "border-primary bg-primary text-white shadow-sm"
                                                      : "border-black/10 bg-white text-primary hover:border-primary/25"
                                                  }`}
                                                  onClick={() =>
                                                    handleSelectOption(
                                                      selectedMenu,
                                                      {
                                                        date: day.date,
                                                        weekday: day.weekday,
                                                        sectionId: section.id,
                                                        sectionName: section.name,
                                                        optionId: option.id,
                                                        productId: option.productId,
                                                        name: option.name,
                                                        itemType: option.itemType,
                                                        unitPrice: option.menuPrice,
                                                      },
                                                      slotKey
                                                    )
                                                  }
                                                >
                                                  <p className="font-semibold leading-snug">{option.name}</p>
                                                  <p
                                                    className={`mt-0.5 line-clamp-2 text-xs leading-relaxed ${
                                                      isSelected ? "text-white/85" : "text-muted"
                                                    }`}
                                                  >
                                                    {option.description || "—"}
                                                  </p>
                                                  <p
                                                    className={`mt-1.5 text-xs font-bold ${
                                                      isSelected ? "text-white" : "text-accent"
                                                    }`}
                                                  >
                                                    {formatPrice(option.menuPrice)}
                                                  </p>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </details>
                                      );
                                    });
                                  })()}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-muted">
                      Todavía no hay un menú activo para tu grupo en estas fechas.
                    </p>
                  )}
                </div>

                <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                  <div className="rounded-ui border border-black/10 bg-white p-6 shadow-sm">
                    <h3 className="font-display text-xl font-semibold text-primary">Resumen</h3>
                    <p className="text-sm text-muted">
                      Revisá las opciones elegidas. Al confirmar se guarda el pedido y se abre WhatsApp con el
                      texto listo para enviar.
                    </p>
                    <div className="mt-5 space-y-3">
                      {currentSelections.length === 0 && (
                        <p className="text-sm text-muted">Todavía no elegiste nada.</p>
                      )}
                      {currentSelections.map((selection) => (
                        <div
                          key={`${selection.date}-${selection.sectionId}`}
                          className="rounded-2xl border border-black/10 px-4 py-3"
                        >
                          <p className="text-sm font-semibold text-primary">{selection.name}</p>
                          <p className="text-xs text-muted">
                            {formatShortDate(selection.date)} · {selection.sectionName}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-accent">
                            {formatPrice(selection.unitPrice)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-soft/50 px-4 py-3">
                      <span className="text-sm font-semibold text-primary">Total</span>
                      <span className="text-sm font-semibold text-primary">{formatPrice(currentTotal)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmitOrder}
                      className={`mt-5 w-full rounded-full px-4 py-3 text-sm font-semibold text-white ${
                        currentSelections.length > 0 ? "bg-accent" : "pointer-events-none bg-muted/40"
                      }`}
                    >
                      Guardar y enviar por WhatsApp
                    </button>
                  </div>

                  <div className="rounded-ui border border-black/10 bg-white p-6 shadow-sm">
                    <h3 className="font-display text-xl font-semibold text-primary">Próximos menús</h3>
                    <div className="mt-4 space-y-3">
                      {upcomingMenus.length === 0 && (
                        <p className="text-sm text-muted">No hay próximos períodos cargados.</p>
                      )}
                      {upcomingMenus.map((menu) => (
                        <div key={menu.id} className="rounded-2xl border border-black/10 px-4 py-3">
                          <p className="text-sm font-semibold text-primary">{menu.name}</p>
                          <p className="text-xs text-muted">
                            {MENU_CYCLE_LABELS[menu.cycle]} · {formatLongDate(menu.startDate)} a{" "}
                            {formatLongDate(menu.endDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-ui border border-black/10 bg-white p-6 shadow-sm">
                    <h3 className="font-display text-xl font-semibold text-primary">Tus pedidos recientes</h3>
                    <div className="mt-4 space-y-3">
                      {myOrders.length === 0 && (
                        <p className="text-sm text-muted">Todavía no generaste pedidos desde esta cuenta.</p>
                      )}
                      {myOrders.slice(0, 5).map((order) => (
                        <div key={order.id} className="rounded-2xl border border-black/10 px-4 py-3">
                          <p className="text-sm font-semibold text-primary">{order.id}</p>
                          <p className="text-xs text-muted">
                            {new Intl.DateTimeFormat("es-AR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            }).format(new Date(order.createdAt))}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {order.selections.length} ítems · {formatPrice(order.total)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
};
