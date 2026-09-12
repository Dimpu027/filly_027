import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { API, ApiError } from "@/utils/api";

/** A full page, injected via `manifest.routes`. Costs zero changes to core. */
export default function ExamplePage() {
  const { t } = useTranslation();
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["care_payroll", "config"],
    queryFn: () => API.config(),
    retry: false,
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">{t("payroll__page_title")}</h1>
      <p className="mt-2 text-sm text-gray-600">
        {isLoading
          ? t("payroll__loading")
          : isError
            ? error instanceof ApiError && error.status === 401
              ? t("payroll__unauthorized")
              : error instanceof ApiError
                ? error.message
                : t("payroll__error")
          : `enabled: ${String(data?.enabled)}`}
      </p>
      {isError && (
        <button
          type="button"
          className="mt-4 rounded-md border px-3 py-2 text-sm"
          onClick={() => void refetch()}
        >
          {t("payroll__retry")}
        </button>
      )}
    </div>
  );
}
