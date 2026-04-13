import { useMemo, useState } from "react";
import type { Institution, InstitutionUser, UserApprovalStatus } from "../types";
import { USER_STATUS_LABELS } from "../utils/institutional";

type AdminInstitutionUsersProps = {
  institutions: Institution[];
  users: InstitutionUser[];
  setUsers: React.Dispatch<React.SetStateAction<InstitutionUser[]>>;
  onChangeStatus: (userId: string, status: UserApprovalStatus) => void;
};

export const AdminInstitutionUsers = ({
  institutions,
  users,
  setUsers,
  onChangeStatus,
}: AdminInstitutionUsersProps) => {
  const [statusFilter, setStatusFilter] = useState<UserApprovalStatus | "all">("all");
  const [query, setQuery] = useState("");

  const institutionById = useMemo(
    () => new Map(institutions.map((institution) => [institution.id, institution])),
    [institutions]
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users
      .filter((user) => (statusFilter === "all" ? true : user.status === statusFilter))
      .filter((user) => {
        if (!normalizedQuery) return true;
        const institution = institutionById.get(user.institutionId);
        return (
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(normalizedQuery) ||
          user.email.toLowerCase().includes(normalizedQuery) ||
          user.username.toLowerCase().includes(normalizedQuery) ||
          institution?.name.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [institutionById, query, statusFilter, users]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary">Usuarios institucionales</h2>
        <p className="text-sm text-muted">
          Aprobación centralizada por parte del dueño del negocio.
        </p>
      </div>

      <div className="grid gap-3 rounded-ui border border-black/10 bg-white p-4 lg:grid-cols-[1fr_auto]">
        <input
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          placeholder="Buscar por nombre, email, usuario o institución"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 text-xs">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              type="button"
              className={`rounded-full px-3 py-2 font-semibold ${
                statusFilter === status
                  ? "bg-primary text-white"
                  : "border border-black/10 bg-white text-primary"
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "Todos" : USER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => {
          const institution = institutionById.get(user.institutionId);
          return (
            <div key={user.id} className="rounded-ui border border-black/10 bg-white p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-primary">
                      {user.firstName} {user.lastName}
                    </p>
                    <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted">
                      {USER_STATUS_LABELS[user.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {institution?.name ?? "Institución eliminada"} · {user.email}
                  </p>
                  <p className="text-xs text-muted">
                    Tel. {user.phone} · Usuario {user.username}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    Alta:{" "}
                    {new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(
                      new Date(user.createdAt)
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    className="rounded-full border border-black/10 px-3 py-1"
                    onClick={() => onChangeStatus(user.id, "pending")}
                  >
                    Pendiente
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-primary px-3 py-1 text-primary"
                    onClick={() => onChangeStatus(user.id, "approved")}
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-accent px-3 py-1 text-accent"
                    onClick={() => onChangeStatus(user.id, "rejected")}
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-black/10 px-3 py-1"
                    onClick={() => setUsers((prev) => prev.filter((entry) => entry.id !== user.id))}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredUsers.length === 0 && (
          <div className="rounded-ui border border-black/10 bg-white p-5 text-sm text-muted">
            No hay usuarios con esos filtros.
          </div>
        )}
      </div>
    </section>
  );
};
