# DEPLOYMENT_GATES


## Gate 1 update — confirmed by human

Verified:
- Production origin: `https://services.arpa.tpctax.dof.gov.taipei`
- Hosting owner: Taipei City Revenue Service IT team
- Delivery model: static frontend package handed to IT and hosted on the agency server
- Official 1999 page can add a normal hyperlink/button to the standalone page
- No iframe is required
- No custom backend is required by this frontend

Remaining unknown:
- exact public path / final full URL beneath the confirmed origin

Gate 1 status:
- **PARTIALLY PASSED** — origin and hosting model are confirmed; exact path remains pending.

Implication for later gates:
- Allowed-domain work can now be planned against the confirmed origin.
- CSP/resource loading can now be planned for the confirmed origin.
- Final `hostingUrl` in `assets/config.js` must wait for the full path.
