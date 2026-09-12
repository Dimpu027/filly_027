from django.apps import AppConfig

PLUGIN_NAME = "care_payroll"


class CarePayrollConfig(AppConfig):
    name = PLUGIN_NAME
    verbose_name = "Care Payroll"

    def ready(self):
        from care_payroll import signals  # noqa: F401
