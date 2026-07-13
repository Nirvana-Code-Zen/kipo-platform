from emisor.emisor import Emisor


def to_facturapi_payload(emisor: Emisor) -> dict:
    """Translates Kipo's agnostic pdf-customization fields to FacturAPI's exact
    wire format (pdf_custom_section + pdf_options). Not called from anywhere yet —
    no real FacturAPI stamp/generate call exists in this codebase. Once IPacClient
    (see emisor/pac_client.py) gains a real stamp/generate method, that adapter
    should call this function to build the relevant slice of the request payload.
    """
    opts = emisor.display_options or {}
    return {
        "pdf_custom_section": emisor.custom_section_html or "",
        "pdf_options": {
            "codes": opts.get("show_catalog_codes", True),
            "product_key": opts.get("show_product_key", True),
            "address_codes": opts.get("show_address_codes", True),
            "export_key": opts.get("show_export_key", False),
            "round_unit_price": opts.get("round_unit_price", False),
            "tax_breakdown": opts.get("show_tax_breakdown", True),
            "ieps_breakdown": opts.get("show_ieps_breakdown", True),
            "combine_ieps_with_subtotal": opts.get("combine_ieps_with_subtotal", False),
            "repeat_signature": opts.get("repeat_signature_each_page", False),
        },
    }


# FacturAPI's real contract also includes complement toggles
# (render_carta_porte, render_iedu, render_hyp_complement, render_comercio_exterior)
# and payroll_options.* for nómina. These are intentionally out of scope here —
# Kipo only issues normal ingreso/egreso CFDI today.
