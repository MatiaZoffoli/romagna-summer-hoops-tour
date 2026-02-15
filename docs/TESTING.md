# Testing the latest features

How to manually test and see the main features of the Romagna Summer Hoops Tour site.

| Feature | How to see it |
|--------|----------------|
| **Tappa pop-up** | The pop-up appears when there is a tappa with `stato` = `confermata` or `in_corso` and `data` between today and today + 7 days. **To test:** In Supabase (or admin when tappe are editable), create or set a tappa with date in the next 7 days and stato `confermata`; open the site (any page). The pop-up is dismissible; dismissal is stored in `localStorage` per tappa (`tappa-promo-dismissed-{id}`). Clear that key or use another browser/incognito to see it again. |
| **Map** | Go to [/tappe/mappa](http://localhost:3000/tappe/mappa) (or use “Vedi la mappa del Tour” from the tappe page). Markers appear only for tappe that have `lat` and `lng` set. **To test:** In admin, edit a tappa and set latitude/longitude (e.g. from Google Maps); save, then reload the map page. |
| **MVP** | Go to [/mvp](http://localhost:3000/mvp). The page shows one slot per tappa confermata/in_corso/conclusa: either the nominated MVP or a placeholder (basket silhouette, “In attesa della nomina”). Click a placeholder to open a modal with the future MVP schema (photo, bio, carriera, stats). |
| **Live classifica** | Open [/classifica](http://localhost:3000/classifica) and leave the tab open; the page refreshes data every 60 seconds. Alternatively, have an admin add or edit a result (which triggers revalidation); the next navigation or refresh shows the new data. |
| **Social +5 pts** | **Request:** Log in as a team, go to the dashboard, use “Richiedi bonus social” (select a tappa where the team has a result, optional link). **Approve:** In admin, open the “Bonus social” tab and approve (or reject) the request. Then check [/classifica](http://localhost:3000/classifica) for the “Social” column and increased points. |
| **Team stats** | In admin, when adding a result for a tappa, fill the optional fields (partite giocate, vinte, punti fatti/subiti). Then open a squadra page [/squadre/[id]](http://localhost:3000/squadre/...) that has at least one result with those fields; the “Statistiche” block appears. |
