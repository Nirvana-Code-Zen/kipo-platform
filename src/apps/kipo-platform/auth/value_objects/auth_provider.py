from shared.exceptions import BusinessRuleViolation

_SUPPORTED = frozenset({"email", "phone", "google", "facebook"})


class AuthProvider(str):
    def __new__(cls, value: str) -> "AuthProvider":
        normalized = value.strip().lower() if value else ""
        if normalized not in _SUPPORTED:
            raise BusinessRuleViolation(
                f"'{value}' is not a supported auth provider. Choose from: {', '.join(sorted(_SUPPORTED))}."
            )
        return super().__new__(cls, normalized)
