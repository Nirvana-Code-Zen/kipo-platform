import nh3
from emisor.repository import IEmisorRepository
from emisor.emisor import Emisor
from emisor.pdf_customization_constants import ALLOWED_HTML_TAGS, KNOWN_DISPLAY_OPTION_KEYS
from shared.exceptions import BusinessRuleViolation, NotFound


def execute(
    repo: IEmisorRepository,
    schema_name: str,
    custom_section_html: str | None,
    display_options: dict,
) -> Emisor:
    provided_keys = set(display_options.keys())
    if provided_keys != KNOWN_DISPLAY_OPTION_KEYS:
        missing = KNOWN_DISPLAY_OPTION_KEYS - provided_keys
        unknown = provided_keys - KNOWN_DISPLAY_OPTION_KEYS
        details = []
        if missing:
            details.append(f"missing keys: {sorted(missing)}")
        if unknown:
            details.append(f"unknown keys: {sorted(unknown)}")
        raise BusinessRuleViolation(f"Invalid display_options ({'; '.join(details)})")

    sanitized_html = nh3.clean(custom_section_html or "", tags=ALLOWED_HTML_TAGS, attributes={})

    existing = repo.find(schema_name)
    if existing is None:
        raise NotFound("No fiscal data configured for this tenant yet")

    return repo.update_pdf_customization(schema_name, sanitized_html, display_options)
