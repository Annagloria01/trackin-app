import { useState, useEffect } from 'react';

function App() {
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({ companyName: '', jobTitle: '', applicationStatus: 'NOT_CONTACTED' });

  // 1. CARICAMENTO DATI (GET)
  useEffect(() => {
    fetch("http://localhost:8080/api/job-applications")
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error("Errore nel caricamento dei dati:", err));
  }, []);

  // Gestione colori badge (Allineata perfettamente con gli Enum del backend Java)
  const getStatusStyle = (status) => {
    switch (status) {
      case 'NOT_CONTACTED': 
        return { bg: '#e0f2fe', text: '#0369a1', label: 'Candidato' };
      case 'HR_CONTACTED': 
        return { bg: '#f3e8ff', text: '#6b21a8', label: 'Contatto HR' };
      case 'INTERVIEW_SCHEDULED': 
        return { bg: '#fef3c7', text: '#b45309', label: 'Colloquio' };
      case 'OFFER_RECEIVED': 
        return { bg: '#dcfce7', text: '#15803d', label: 'Offerta Ricevuta' };
      case 'REJECTED': 
        return { bg: '#fee2e2', text: '#b91c1c', label: 'Rifiutato' };
      default: 
        return { bg: '#f3f4f6', text: '#374151', label: status || 'Sconosciuto' };
    }
  };

  // 2. SALVATAGGIO DATI (POST)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.jobTitle) return;

    fetch("http://localhost:8080/api/job-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Errore nel salvataggio");
        return res.json();
      })
      .then(newSavedApplication => {
        setApplications([newSavedApplication, ...applications]);
        setFormData({ companyName: '', jobTitle: '', applicationStatus: 'NOT_CONTACTED' });
      })
      .catch(err => console.error("Errore nell'invio:", err));
  };

  // 3. AGGIORNAMENTO STATO IN LINEA (PUT - sicuro con payload completo per Spring validation)
  const handleStatusChange = (id, newStatus) => {
    const currentApp = applications.find(app => app.id === id);
    if (!currentApp) return;

    // Aggiornamento ottimistico della UI
    const updatedApplications = applications.map(app =>
      app.id === id ? { ...app, applicationStatus: newStatus } : app
    );
    setApplications(updatedApplications);

    // Richiesta di update inviando l'intero oggetto modificato per passare i controlli @NotBlank del backend
    fetch(`http://localhost:8080/api/job-applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...currentApp,
        applicationStatus: newStatus
      })
    })
      .catch(err => console.error("Errore durante l'aggiornamento dello stato:", err));
  };

  return (
    <div style={styles.container}>
      {/* Header Centrato */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>💼</span>
          <div>
            <h1 style={styles.title}>TrackIn</h1>
            <p style={styles.subtitle}>Gestisci le tue candidature e i tuoi progressi tech</p>
          </div>
        </div>
      </header>

      <div style={styles.mainGrid}>
        {/* Form di Inserimento */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Aggiungi Candidatura</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Azienda</label>
              <input
                type="text"
                placeholder="Es. Google, Ducati..."
                style={styles.input}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Posizione</label>
              <input
                type="text"
                placeholder="Es. Junior Java Developer..."
                style={styles.input}
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Stato Iniziale</label>
              <select
                style={styles.select}
                value={formData.applicationStatus}
                onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value })}
              >
                <option value="NOT_CONTACTED">Candidato</option>
                <option value="HR_CONTACTED">Contatto HR</option>
                <option value="INTERVIEW_SCHEDULED">Colloquio</option>
                <option value="OFFER_RECEIVED">Offerta Ricevuta</option>
                <option value="REJECTED">Rifiutato</option>
              </select>
            </div>

            <button type="submit" style={styles.button}>Salva Posizione</button>
          </form>
        </section>

        {/* Lista / Tabella delle Candidature */}
        <section style={styles.cardLarge}>
          <div style={styles.tableHeader}>
            <h2 style={styles.cardTitle}>Le Tue Candidature</h2>
            <span style={styles.counter}>{applications.length} Totali</span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Azienda</th>
                  <th style={styles.th}>Posizione tech</th>
                  <th style={styles.th}>Data</th>
                  <th style={styles.th}>Stato</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const badge = getStatusStyle(app.applicationStatus);
                  return (
                    <tr key={app.id || Math.random()} style={styles.tr}>
                      <td style={styles.tdCompanyName}>{app.companyName}</td>
                      <td style={styles.td}>{app.jobTitle}</td>
                      <td style={styles.tdDate}>{app.date || new Date().toLocaleDateString()}</td>
                      <td style={styles.td}>
                        {}
                        <select
                          value={app.applicationStatus}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          style={{
                            ...styles.badge,
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            paddingRight: '22px', 
                            position: 'relative'
                          }}
                        >
                          <option value="NOT_CONTACTED">Candidato ▾</option>
                          <option value="HR_CONTACTED">Contatto HR ▾</option>
                          <option value="INTERVIEW_SCHEDULED">Colloquio ▾</option>
                          <option value="OFFER_RECEIVED">Offerta Ricevuta ▾</option>
                          <option value="REJECTED">Rifiutato ▾</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

// Oggetto contenente gli stili CSS della Dashboard
const styles = {
  container: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1e293b',
    padding: '40px 20px'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 40px auto',
    textAlign: 'center'
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  logoIcon: {
    fontSize: '36px',
    backgroundColor: '#ffffff',
    padding: '12px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  mainGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '32px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.04)',
    height: 'fit-content'
  },
  cardLarge: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.04)'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  counter: {
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '6px 12px',
    borderRadius: '9999px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontSize: '14px',
    outline: 'none'
  },
  select: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    color: '#1e293b',
    backgroundColor: '#ffffff',
    outline: 'none',
    cursor: 'pointer'
  },
  button: {
    marginTop: '8px',
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    borderBottom: '1px solid #f1f5f9'
  },
  th: {
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9'
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#334155'
  },
  tdCompanyName: {
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#0f172a'
  },
  tdDate: {
    padding: '16px',
    fontSize: '13px',
    color: '#94a3b8'
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  }
};

export default App;