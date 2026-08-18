# Maintainr Experience Architecture

## Purpose

Maintainr will use an original, role-aware property-maintenance journey. The design draws only on general public patterns observed in RunFleet: progressive feature explanation, low-friction demo exploration, and repeated conversion paths. It does not reproduce RunFleet’s content, testimonials, claims, layout, source code, or assets.

## Public Journey

| Visitor need | Maintainr route | Data boundary | Primary action |
|---|---|---|---|
| Understand the platform | Public product, features, and role pages | No customer data | Explore the role workflow |
| Explore without sharing data | `/demo` | Browser-only fictional data | Choose a role and try a sample workflow |
| Plan a tailored walkthrough | `/quote?intent=demo` | Commercial quotation database only | Request a guided demo |
| Obtain commercial evaluation | `/quote?intent=quote` | Commercial quotation database only | Request a quotation |
| Enter a real account | `VITE_SAAS_APP_URL/sign-in` | Isolated SaaS database only | Sign in to customer portal |
| Start a real private workspace | `VITE_SAAS_APP_URL/create-workspace` | Isolated SaaS database only | Create workspace |

## Information Architecture

The commercial header will prioritise **Request a demo** and **Request a quotation**. An existing-customer portal link will be visually secondary and route directly to the SaaS URL, never to a commercial fallback route. Product navigation will focus on a practical property-maintenance workflow, role outcomes, trust boundaries, and resources.

The demo will remain a safe product tour. It will provide an entry choice, role selector, operational dashboard, and distinct pathway to either a guided demo request or a real private workspace. No visitor identifier, customer record, media, notification, webhook, export, or SaaS API call may be used by the demo.

## Live SaaS Journey

The authenticated SaaS already routes users by role after a common sign-in. Managers coordinate access, tickets, reminders, workspace identity, and notification settings; residents report and track work; technicians receive and complete assigned work; owners review portfolio activity. The commercial website will link to this role-aware system rather than cloning portal UI into the public product.

## Production Guardrails

The commercial site will retain only `COMMERCIAL_DATABASE_URL` and `VITE_SAAS_APP_URL`. The SaaS site will retain `DATABASE_URL` and never receive commercial quote data. All CTA links that cross the product boundary must use the configured public SaaS URL. Every public request must make the next destination, data purpose, and data boundary clear in English and Arabic.

## Reference

The public-pattern review is recorded in [RunFleet reference notes](./RUNFLEET_REFERENCE_NOTES.md).
