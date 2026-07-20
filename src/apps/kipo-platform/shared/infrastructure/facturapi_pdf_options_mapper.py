from emisor.emisor import Emisor


def to_facturapi_payload(emisor: Emisor) -> dict:
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
