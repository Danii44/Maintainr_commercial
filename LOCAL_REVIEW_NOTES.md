# Local Review Notes

The commercial home Product Tour now contains a single **Explore the experience** action and three short explanatory cards. It no longer contains the embedded role-switching mini dashboard.

The local `/experience` route now presents the interactive Maintainr workspace as the primary full-screen page content. The role selector, sidebar, workspace panels, session-only notice, maintenance request actions, and return-to-site control remain available. This verification used only the local server; no Netlify deployment or live customer data was accessed.

The local `/experience` route now begins with an isolated commercial demo sign-in screen. The Property Manager demo account signed in successfully and loaded a persisted workspace showing demo tickets and the planned reminder from the separate commercial database. The workspace explicitly identifies the commercial demo boundary and did not access the live SaaS database.

The Property Manager acknowledged the visible planned reminder locally. The workspace refreshed to the acknowledged state, confirming the interaction persists within the commercial demo database rather than browser-only state or the live SaaS database.

The Property Manager request workflow was also verified: the open Kitchen water issue was assigned to the demo technician and then rendered as `ASSIGNED` after the workspace refreshed. This persisted change is confined to the commercial demo database.

After signing out the manager account and signing in as the Technician demo account, both assigned tickets were visible with the role-gated **Start work** controls. This confirms the assigned work is shared across demo roles through the isolated commercial database, not through browser-local state or the live SaaS database.
