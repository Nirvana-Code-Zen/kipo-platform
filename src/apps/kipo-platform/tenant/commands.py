from dataclasses import dataclass, field


@dataclass(frozen=True)
class RegisterTenantCommand:
    auth_id: str
    name: str
    schema_name: str
    plan_type: str = "free"
    timezone: str = "America/Mexico_City"
    currency: str = "MXN"
    storage_quota_bytes: int = 5_368_709_120  # 5 GB
    features_enabled: tuple[str, ...] = field(default_factory=tuple)
