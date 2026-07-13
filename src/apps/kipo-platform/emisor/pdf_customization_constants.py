# Keep in sync with frontend: src/apps/kipo-dashboard/src/settings/ui/components/pdfCustomizationConstants.ts
ALLOWED_HTML_TAGS = frozenset({
    "h1", "h2", "h3", "h4", "h5", "h6", "div", "p", "span", "small", "br",
    "b", "i", "ul", "ol", "li", "strong", "table", "thead", "tbody", "tfoot", "tr", "th", "td",
})

DEFAULT_DISPLAY_OPTIONS: dict = {
    "show_catalog_codes": True,
    "show_product_key": True,
    "show_address_codes": True,
    "show_export_key": False,
    "round_unit_price": False,
    "show_tax_breakdown": True,
    "show_ieps_breakdown": True,
    "combine_ieps_with_subtotal": False,
    "repeat_signature_each_page": False,
}

KNOWN_DISPLAY_OPTION_KEYS = frozenset(DEFAULT_DISPLAY_OPTIONS.keys())
