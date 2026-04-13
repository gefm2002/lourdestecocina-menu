import { useMemo, useState } from "react";
import type { Institution, InstitutionalOrder, ProductionStatus, ProductionStatusMap } from "../types";
import { formatNumber } from "../utils/format";
import {
  buildProductionKey,
  formatLongDate,
  PRODUCT_TYPE_LABELS,
  PRODUCTION_STATUS_LABELS,
} from "../utils/institutional";

type AdminKitchenBoardProps = {
  institutions: Institution[];
  orders: InstitutionalOrder[];
  productionStatuses: ProductionStatusMap;
  setProductionStatuses: React.Dispatch<React.SetStateAction<ProductionStatusMap>>;
};

export const AdminKitchenBoard = ({
  institutions,
  orders,
  productionStatuses,
  setProductionStatuses,
}: AdminKitchenBoardProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const institutionById = useMemo(
    () => new Map(institutions.map((institution) => [institution.id, institution])),
    [institutions]
  );

  const groupedByDate = useMemo(() => {
    const map = new Map<
      string,
      Array<{
        date: string;
        productId: string;
        name: string;
        itemType: InstitutionalOrder["selections"][number]["itemType"];
        quantity: number;
        institutions: Set<string>;
        orders: Set<string>;
      }>
    >();

    orders.forEach((order) => {
      order.selections.forEach((selection) => {
        const institutionName = institutionById.get(order.institutionId)?.name ?? "Sin institución";
        const items = map.get(selection.date) ?? [];
        const existing = items.find((item) => item.productId === selection.productId);
        if (existing) {
          existing.quantity += 1;
          existing.institutions.add(institutionName);
          existing.orders.add(order.id);
        } else {
          items.push({
            date: selection.date,
            productId: selection.productId,
            name: selection.name,
            itemType: selection.itemType,
            quantity: 1,
            institutions: new Set([institutionName]),
            orders: new Set([order.id]),
          });
        }
        map.set(selection.date, items);
      });
    });

    return [...map.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name)),
      }));
  }, [institutionById, orders]);

  const currentDay = groupedByDate.find((entry) => entry.date === selectedDate) ?? groupedByDate[0];
  const statusSummary = useMemo(() => {
    const summary: Record<ProductionStatus, number> = {
      pending: 0,
      "in-progress": 0,
      ready: 0,
      delivered: 0,
    };
    currentDay?.items.forEach((item) => {
      const status = productionStatuses[buildProductionKey(item.date, item.productId)] ?? "pending";
      summary[status] += 1;
    });
    return summary;
  }, [currentDay, productionStatuses]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-primary">Orden general de cocina</h2>
          <p className="text-sm text-muted">
            Checklist operativo por día para marcar el avance de producción.
          </p>
        </div>
        <select
          className="rounded-full border border-black/10 px-4 py-2 text-sm"
          value={currentDay?.date ?? ""}
          onChange={(event) => setSelectedDate(event.target.value)}
        >
          {groupedByDate.map((entry) => (
            <option key={entry.date} value={entry.date}>
              {formatLongDate(entry.date)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(statusSummary).map(([status, value]) => (
          <div key={status} className="rounded-ui border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {PRODUCTION_STATUS_LABELS[status as ProductionStatus]}
            </p>
            <p className="mt-2 text-2xl font-semibold text-primary">{formatNumber(value)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-ui border border-black/10 bg-white p-6">
        {!currentDay && <p className="text-sm text-muted">Todavía no hay producción generada.</p>}

        {currentDay && (
          <div className="space-y-4">
            {currentDay.items.map((item) => {
              const key = buildProductionKey(item.date, item.productId);
              const status = productionStatuses[key] ?? "pending";
              return (
                <div key={key} className="rounded-2xl border border-black/10 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-primary">{item.name}</p>
                      <p className="text-xs text-muted">
                        {PRODUCT_TYPE_LABELS[item.itemType]} · {formatNumber(item.quantity)} unidades ·{" "}
                        {item.orders.size} órdenes
                      </p>
                      <p className="text-xs text-muted">
                        Instituciones: {[...item.institutions].join(", ")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {(["pending", "in-progress", "ready", "delivered"] as ProductionStatus[]).map(
                        (value) => (
                          <button
                            key={value}
                            type="button"
                            className={`rounded-full px-3 py-2 font-semibold ${
                              status === value
                                ? "bg-primary text-white"
                                : "border border-black/10 bg-white text-primary"
                            }`}
                            onClick={() =>
                              setProductionStatuses((prev) => ({
                                ...prev,
                                [key]: value,
                              }))
                            }
                          >
                            {PRODUCTION_STATUS_LABELS[value]}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
