import { useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import type { Institution, InstitutionType } from "../types";
import { slugify } from "../utils/institutional";

type AdminInstitutionManagerProps = {
  institutions: Institution[];
  setInstitutions: React.Dispatch<React.SetStateAction<Institution[]>>;
};

type ModalState =
  | {
      mode: "add" | "edit";
      institution?: Institution;
    }
  | null;

const typeLabels: Record<InstitutionType, string> = {
  educativa: "Educativa",
  otras: "Otras",
};

export const AdminInstitutionManager = ({
  institutions,
  setInstitutions,
}: AdminInstitutionManagerProps) => {
  const [modal, setModal] = useState<ModalState>(null);
  const orderedInstitutions = useMemo(
    () => [...institutions].sort((a, b) => a.name.localeCompare(b.name)),
    [institutions]
  );

  const saveInstitution = (institution: Institution, mode: "add" | "edit") => {
    setInstitutions((prev) => {
      if (mode === "add") return [...prev, institution];
      return prev.map((item) => (item.id === institution.id ? institution : item));
    });
    setModal(null);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-primary">Instituciones</h2>
          <p className="text-sm text-muted">
            Alta, edición y activación de instituciones educativas u otras.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setModal({ mode: "add" })}
        >
          Nueva institución
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {orderedInstitutions.map((institution) => (
          <div key={institution.id} className="rounded-ui border border-black/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-primary">{institution.name}</p>
                <p className="text-xs text-muted">{institution.address}</p>
              </div>
              <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted">
                {typeLabels[institution.type]}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted">ID: {institution.id}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                className="rounded-full border border-black/10 px-3 py-1"
                onClick={() =>
                  setInstitutions((prev) =>
                    prev.map((item) =>
                      item.id === institution.id ? { ...item, isActive: !item.isActive } : item
                    )
                  )
                }
              >
                {institution.isActive ? "Desactivar" : "Activar"}
              </button>
              <button
                type="button"
                className="rounded-full border border-black/10 px-3 py-1"
                onClick={() => setModal({ mode: "edit", institution })}
              >
                Editar
              </button>
              <button
                type="button"
                className="rounded-full border border-accent px-3 py-1 text-accent"
                onClick={() =>
                  setInstitutions((prev) => prev.filter((item) => item.id !== institution.id))
                }
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={modal?.mode === "add" ? "Nueva institución" : "Editar institución"}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      >
        {modal && (
          <InstitutionForm
            institution={modal.institution}
            mode={modal.mode}
            onSave={saveInstitution}
          />
        )}
      </Modal>
    </section>
  );
};

const InstitutionForm = ({
  institution,
  mode,
  onSave,
}: {
  institution?: Institution;
  mode: "add" | "edit";
  onSave: (institution: Institution, mode: "add" | "edit") => void;
}) => {
  const [name, setName] = useState(institution?.name ?? "");
  const [address, setAddress] = useState(institution?.address ?? "");
  const [type, setType] = useState<InstitutionType>(institution?.type ?? "educativa");
  const [isActive, setIsActive] = useState(institution?.isActive ?? true);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(
          {
            id: institution?.id ?? slugify(name),
            name: name.trim(),
            address: address.trim(),
            type,
            isActive,
          },
          mode
        );
      }}
    >
      <input
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        placeholder="Nombre de la institución"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <input
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        placeholder="Dirección"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        required
      />
      <select
        className="w-full rounded-full border border-black/10 px-4 py-2 text-sm"
        value={type}
        onChange={(event) => setType(event.target.value as InstitutionType)}
      >
        <option value="educativa">Educativa</option>
        <option value="otras">Otras</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Institución activa
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
      >
        Guardar institución
      </button>
    </form>
  );
};
