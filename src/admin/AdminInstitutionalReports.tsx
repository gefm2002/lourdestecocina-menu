import { useMemo, useState } from "react";
import type { Institution, InstitutionUser, InstitutionalOrder } from "../types";
import { formatNumber, formatPrice } from "../utils/format";
import { PRODUCT_TYPE_LABELS } from "../utils/institutional";

type AdminInstitutionalReportsProps = {
  institutions: Institution[];
  users: InstitutionUser[];
  orders: InstitutionalOrder[];
};

export const AdminInstitutionalReports = ({
  institutions,
  users,
  orders,
}: AdminInstitutionalReportsProps) => {
  const [institutionFilter, setInstitutionFilter] = useState<string>("all");

  const institutionById = useMemo(
    () => new Map(institutions.map((institution) => [institution.id, institution])),
    [institutions]
  );
  const userById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);

  const filteredOrders = useMemo(
    () =>
      institutionFilter === "all"
        ? orders
        : orders.filter((order) => order.institutionId === institutionFilter),
    [institutionFilter, orders]
  );

  const generalTotals = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalSelections = filteredOrders.reduce((acc, order) => acc + order.selections.length, 0);
    const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.total, 0);
    return { totalOrders, totalSelections, totalRevenue };
  }, [filteredOrders]);

  const institutionSummaries = useMemo(
    () =>
      institutions.map((institution) => {
        const ordersForInstitution = orders.filter((order) => order.institutionId === institution.id);
        return {
          institution,
          orderCount: ordersForInstitution.length,
          selectionCount: ordersForInstitution.reduce(
            (acc, order) => acc + order.selections.length,
            0
          ),
          revenue: ordersForInstitution.reduce((acc, order) => acc + order.total, 0),
        };
      }),
    [institutions, orders]
  );

  const demandByItem = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        itemType: InstitutionalOrder["selections"][number]["itemType"];
        quantity: number;
        revenue: number;
        institutions: Set<string>;
      }
    >();

    filteredOrders.forEach((order) => {
      const institutionName = institutionById.get(order.institutionId)?.name ?? "Sin institución";
      order.selections.forEach((selection) => {
        const key =
          institutionFilter === "all"
            ? `${selection.productId}`
            : `${order.institutionId}-${selection.productId}`;
        const current = map.get(key);
        if (current) {
          current.quantity += 1;
          current.revenue += selection.unitPrice;
          current.institutions.add(institutionName);
          return;
        }
        map.set(key, {
          name: selection.name,
          itemType: selection.itemType,
          quantity: 1,
          revenue: selection.unitPrice,
          institutions: new Set([institutionName]),
        });
      });
    });

    return [...map.values()].sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name));
  }, [filteredOrders, institutionById, institutionFilter]);

  const demandByType = useMemo(() => {
    const map = new Map<
      string,
      {
        type: InstitutionalOrder["selections"][number]["itemType"];
        quantity: number;
        revenue: number;
      }
    >();

    filteredOrders.forEach((order) => {
      order.selections.forEach((selection) => {
        const current = map.get(selection.itemType);
        if (current) {
          current.quantity += 1;
          current.revenue += selection.unitPrice;
          return;
        }
        map.set(selection.itemType, {
          type: selection.itemType,
          quantity: 1,
          revenue: selection.unitPrice,
        });
      });
    });

    return [...map.values()].sort((a, b) => b.quantity - a.quantity);
  }, [filteredOrders]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-primary">Reportes institucionales</h2>
          <p className="text-sm text-muted">
            Consolidado de pedidos, platos y volumen para cocina por institución o general.
          </p>
        </div>
        <select
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          value={institutionFilter}
          onChange={(event) => setInstitutionFilter(event.target.value)}
        >
          <option value="all">Todas las instituciones</option>
          {institutions.map((institution) => (
            <option key={institution.id} value={institution.id}>
              {institution.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ReportCard label="Pedidos" value={formatNumber(generalTotals.totalOrders)} />
        <ReportCard label="Selecciones" value={formatNumber(generalTotals.totalSelections)} />
        <ReportCard label="Facturación" value={formatPrice(generalTotals.totalRevenue)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-ui border border-black/10 bg-white p-6">
          <h3 className="text-xl font-semibold text-primary">Resumen por institución</h3>
          <div className="mt-4 space-y-3">
            {institutionSummaries.map((summary) => (
              <div key={summary.institution.id} className="rounded-2xl border border-black/10 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{summary.institution.name}</p>
                    <p className="text-xs text-muted">{summary.institution.address}</p>
                  </div>
                  <div className="text-right text-xs text-muted">
                    <p>{formatNumber(summary.orderCount)} pedidos</p>
                    <p>{formatNumber(summary.selectionCount)} selecciones</p>
                    <p>{formatPrice(summary.revenue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-ui border border-black/10 bg-white p-6">
          <h3 className="text-xl font-semibold text-primary">Volumen por tipo de producto</h3>
          <div className="mt-4 space-y-3">
            {demandByType.map((item) => (
              <div key={item.type} className="rounded-2xl border border-black/10 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-primary">
                    {PRODUCT_TYPE_LABELS[item.type]}
                  </p>
                  <div className="text-right text-xs text-muted">
                    <p>{formatNumber(item.quantity)} unidades</p>
                    <p>{formatPrice(item.revenue)}</p>
                  </div>
                </div>
              </div>
            ))}
            {demandByType.length === 0 && (
              <p className="text-sm text-muted">Todavía no hay consumo para mostrar.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-ui border border-black/10 bg-white p-6">
        <h3 className="text-xl font-semibold text-primary">Platos agrupados</h3>
        <p className="text-sm text-muted">
          La comanda del usuario se traduce acá en una vista general para cocina y compras.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs uppercase tracking-[0.16em] text-muted">
                <th className="px-3 py-2">Producto</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Cantidad</th>
                <th className="px-3 py-2">Importe</th>
                <th className="px-3 py-2">Instituciones</th>
              </tr>
            </thead>
            <tbody>
              {demandByItem.map((item) => (
                <tr key={`${item.name}-${item.itemType}`} className="border-b border-black/5">
                  <td className="px-3 py-3 font-medium text-primary">{item.name}</td>
                  <td className="px-3 py-3 text-muted">{PRODUCT_TYPE_LABELS[item.itemType]}</td>
                  <td className="px-3 py-3 text-muted">{formatNumber(item.quantity)}</td>
                  <td className="px-3 py-3 text-muted">{formatPrice(item.revenue)}</td>
                  <td className="px-3 py-3 text-muted">
                    {[...item.institutions].join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {demandByItem.length === 0 && (
            <p className="py-4 text-sm text-muted">No hay platos agregados para este filtro.</p>
          )}
        </div>
      </div>

      <div className="rounded-ui border border-black/10 bg-white p-6">
        <h3 className="text-xl font-semibold text-primary">Órdenes recientes</h3>
        <div className="mt-4 space-y-3">
          {filteredOrders
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .slice(0, 8)
            .map((order) => {
              const institution = institutionById.get(order.institutionId);
              const user = userById.get(order.userId);
              return (
                <div key={order.id} className="rounded-2xl border border-black/10 px-4 py-3">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-primary">{order.id}</p>
                      <p className="text-xs text-muted">
                        {institution?.name} · {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted">
                      <p>{formatPrice(order.total)}</p>
                      <p>{formatNumber(order.selections.length)} selecciones</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

const ReportCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-ui border border-black/10 bg-white p-5 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
  </div>
);
