from enum import Enum


class TenantStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED_BILLING = "suspended_billing"
    TRIAL = "trial"
    INACTIVE = "inactive"
