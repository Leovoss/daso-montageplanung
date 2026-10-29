export default function Datenschutz() {
  return (
    <main className="content" style={{ maxWidth: 760 }}>
      <div className="page-title">
        <div>
          <div className="eyebrow">DASO / RECHTLICHES</div>
          <h1>Datenschutzhinweis</h1>
          <p>Zur Montageplanungs-App für Mitarbeiter und Obermonteure.</p>
        </div>
      </div>
      <section className="panel" style={{ padding: "28px 30px", lineHeight: 1.7 }}>
        <h2>1. Verantwortlicher</h2>
        <p>
          DaSo Lüftungsbau GmbH
          <br />
          Am Kohlenweg 1, 56307 Dürrholz
          <br />
          Telefon: +49 2684 9770031
          <br />
          E-Mail: info@dasoluft.com
        </p>

        <h2>2. Zweck der Datenverarbeitung</h2>
        <p>
          Die Anwendung dient der internen Personaleinsatzplanung,
          Arbeitszeiterfassung und Spesen-/Stundenabrechnung bei DaSo
          Lüftungsbau. Sie wird ausschließlich von Mitarbeitenden und
          Obermonteuren des Unternehmens genutzt und ist nicht öffentlich
          zugänglich.
        </p>

        <h2>3. Verarbeitete Datenkategorien</h2>
        <ul>
          <li>Name, dienstliche E-Mail-Adresse, Funktion/Rolle</li>
          <li>Projekt- und Einsatzzuordnung</li>
          <li>Arbeitszeiten: Beginn und Ende der Anwesenheit, Pausenzeiten</li>
          <li>
            Standortdaten: GPS-Koordinaten und Genauigkeit, nur zum
            Zeitpunkt des Ein- und Ausstempelns. Es findet keine
            fortlaufende Ortung statt.
          </li>
          <li>Angaben zur Spesen-/Reisekostenabrechnung, soweit selbst eingetragen</li>
        </ul>

        <h2>4. Zugriffsrechte innerhalb der Anwendung</h2>
        <ul>
          <li>
            <b>Monteur:</b> sieht ausschließlich eigene Einteilungen, eigene
            Stempelzeiten und eigene Spesenabrechnung.
          </li>
          <li>
            <b>Obermonteur:</b> voller Zugriff auf Planung, Projekte und
            Mitarbeiterliste; bei Stempelzeiten und Spesenabrechnung nur die
            eigenen Daten.
          </li>
          <li><b>Planer:</b> voller Zugriff auf alle Bereiche.</li>
        </ul>

        <h2>5. Rechtsgrundlage</h2>
        <p>
          Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
          DSGVO i. V. m. § 26 BDSG, da sie für die Durchführung des
          Beschäftigungsverhältnisses (Personaleinsatzplanung, Arbeitszeit-
          und Spesenerfassung) erforderlich ist.
        </p>

        <h2>6. Speicherdauer</h2>
        <p>
          Stempel-, Standort- und Spesendaten werden für die Dauer des
          Beschäftigungsverhältnisses sowie darüber hinaus so lange
          gespeichert, wie gesetzliche Aufbewahrungspflichten dies
          erfordern (insbesondere § 147 AO, § 257 HGB – in der Regel 6 bis
          10 Jahre für abrechnungsrelevante Unterlagen). Nach Ablauf dieser
          Fristen werden die Daten gelöscht.
        </p>

        <h2>7. Technische Verarbeitung</h2>
        <p>
          Die Anwendung läuft auf der Infrastruktur von Cloudflare Inc.
          (Datenbank und Dateispeicher in der Region Westeuropa). Die
          Auftragsverarbeitung durch Cloudflare erfolgt auf Grundlage des
          von Cloudflare veröffentlichten Customer Data Processing
          Addendum:{" "}
          <a href="https://www.cloudflare.com/cloudflare-customer-dpa/" target="_blank" rel="noreferrer">
            cloudflare.com/cloudflare-customer-dpa
          </a>
          .
        </p>
        <p>
          Beim Anzeigen einer erfassten Stempelposition wird die zugehörige
          GPS-Koordinate zusätzlich an den Kartendienst OpenStreetMap
          (Nominatim) übermittelt, um daraus eine lesbare Adresse
          anzuzeigen. Dabei werden ausschließlich die Koordinaten der
          jeweiligen Stempelposition übertragen.
        </p>

        <h2>8. Rechte der Mitarbeitenden</h2>
        <p>
          Jede betroffene Person hat das Recht auf Auskunft, Berichtigung,
          Löschung und Einschränkung der Verarbeitung ihrer Daten sowie ein
          Beschwerderecht bei der zuständigen Datenschutzaufsichtsbehörde.
          Anfragen richten sich an info@dasoluft.com.
        </p>
      </section>
    </main>
  );
}
