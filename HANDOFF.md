# DaSo Montageplanung – Handoff

## Zweck

Interne Einsatzplanung für DaSo Lüftungsbau. Der aktuelle Stand verwaltet Projekte, Mitarbeiter, Nachunternehmer, tägliche Einteilungen, Baustellenunterlagen, Stempelzeiten und Spesen-/Stundenabrechnungen.

## Aktueller Stand

- Letzter Quellstand: `bf221ae6bd20fd23d8d465a6f13c2e23bc2dba07`
- Aktuelle Produktions-URL: https://daso-montageplanung.info395643.chatgpt.site
- Deployment ist privat und benötigt die vorhandene Plattform-Anmeldung.
- Das Logo liegt unter `public/daso-logo.png`.
- Die Sites-Projektkennung steht in `.openai/hosting.json`.

## Enthaltene Funktionen

- Planung nach Kalenderwoche für Mitarbeiter und Nachunternehmer
- Mehrfachauswahl von Mitarbeitern bei einer Einteilung
- Drag-and-drop-Positionierung von Mitarbeitern/Nachunternehmern
- Mehrere Projekte pro Mitarbeiter und Tag
- Einteilungstypen: Projekt, Homeoffice, Urlaub, unbezahlter Urlaub und Krank
- Nachunternehmer mit separat eintragbarer Monteuranzahl je Einsatz
- Projektfarben, Projekt-/Bestellnummer, Stundenverrechnungssatz und Hinweise
- Kunden und mehrere Ansprechpartner je Kunde mit E-Mail, Arbeitstelefon und Mobilnummer
- Zuständiger DaSo-Obermonteur und Projekt-E-Mail-Adresse
- Projektunterlagen: LV-PDF, Kurztext-LV als Excel, Verträge und Zeichnungen
- Projektdetailansicht aus der Planung mit Adresse, Navigation, Ansprechpartnern, Dateien und eingesetzter Mannschaft
- Bearbeiten und Löschen einzelner Einteilungen sowie markierter Einteilungen
- Stempeluhr mit Baustelle, Anfahrt Baustelle und Homeoffice
- Wöchentliche/monatliche Spesen- und Stundenabrechnung mit manueller Korrekturmöglichkeit
- PDF-Druck im Querformat mit 15 Tagen auf Blatt 1, Zwischensumme und Zusammenfassung auf Blatt 2

## Technischer Aufbau

- Next.js/Vinext mit React und TypeScript
- Cloudflare Worker/Sites als Laufzeit
- Cloudflare D1 mit Drizzle-Migrationen in `drizzle/`
- Cloudflare R2 für Projektdateien
- Hauptoberfläche: `app/page.tsx`
- Styles und DaSo-Farbwelt: `app/globals.css`
- Datenzugriff: `db/` und die API-Routen in `app/`

## Lokale Einrichtung

Voraussetzung: Node.js `>=22.13.0` und pnpm gemäß `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm run build
```

Für die weiteren Sites-/Cloudflare-Schritte bitte die vorhandenen Scripts und `.openai/hosting.json` verwenden. Die Datei `.sites-runtime/` gehört nicht ins Repo und ist deshalb nicht Bestandteil dieses Handoffs.

## Wichtige Übergabepunkte

1. Authentifizierung und Rollenrechte sind für den produktiven Betrieb noch über die Hosting-/Login-Schicht zu ergänzen.
2. Der geplante Monteurzugriff soll nur eigene Einsätze, eigene Stempeluhr und eigene Spesenabrechnung zeigen.
3. Obermonteure sollen nahezu den Planerumfang erhalten, aber bei Stempeluhr und Spesenabrechnung nur die eigenen Daten sehen.
4. Vor einem Hosting außerhalb der bisherigen Plattform müssen D1, R2, Authentifizierung und die Datei-API technisch ersetzt oder angebunden werden.
5. Keine Zugangsdaten oder Repository-Tokens sind im Archiv enthalten.

