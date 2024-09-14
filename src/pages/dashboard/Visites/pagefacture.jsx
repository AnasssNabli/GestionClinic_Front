import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import moment from 'moment';

// Register the custom font
Font.register({ family: 'Roboto', src: 'http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf' });

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    padding: '50px',
  },
  titre: {
    fontSize: '25pt',
    fontWeight: 'bold',
    color: '#50C3E0',
  },
  sTitre: {
    fontSize: '12pt',
    fontWeight: 'bold',
    color: '#371450',
  },
  titre2: {
    fontSize: '30pt',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.37)',
  },
  info: {
    fontSize: '10pt',
    color: '#000000',
    marginTop: '20px',
  },
  infoClient: {
    fontSize: '10pt',
    color: '#000000',
    marginTop: '20px',
  },
  infoFac: {
    fontSize: '10pt',
    fontWeight: 'bold',
    color: '#000000',
    marginTop: '20px',
  },
  table: {
    marginTop: '20px',
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#000',
    borderBottomWidth: '1pt',
    backgroundColor: '#f0f0f0',
    paddingBottom: '8px',
    paddingTop: '8px',
  },
  tablebody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: '1pt',
    paddingBottom: '8px',
    paddingTop: '8px',
  },
  tableCellHeader: {
    paddingLeft:'20px',
    width: '45%',
    fontSize: '10pt',
    fontWeight: 'bold',
    color: '#000',
  },
  tableCell: {
    paddingLeft:'20px',
    width: '45%',
    fontSize: '10pt',
    color: '#000',
  },
  banqueInfo: {
    fontSize: '10pt',
    color: '#000000',
    marginTop: '20px',
  },
  signature: {
    fontSize: '10pt',
    color: '#000000',
    marginTop: '20px',
  },
  footer: {
    marginTop: '20px',
  },
  hr: {
    borderBottomColor: '#000',
    borderBottomWidth: '1pt',
    marginTop: '20px',
  },
  footerText: {
    fontWeight: 'bold',
    fontSize: '10pt',
  },
});

export const Invoice = ({ visite }) => {
  const formattedDate = moment(visite.date).format('DD/MM/YYYY');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.titre}>ALEXSYS</Text>
        <Text style={styles.sTitre}>SOLUTIONS</Text>
        <Text style={styles.titre2}>VISITE MÉDICALE</Text>

        {/* Doctor and Patient Info */}
        <Text style={styles.info}>
          Médecin: {visite.medecinName || 'Médecin inconnu'}{'\n'}
          Patient: {visite.patientName || 'Patient inconnu'}
        </Text>

        {/* Visit Info */}
        <Text style={styles.infoFac}>
          Date de la visite: {formattedDate}{'\n'}
          Montant: {visite.montant} Dhs{'\n'}
          Notes: {visite.notes || 'Aucune note'}
        </Text>

        {/* Medication Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>Nom du médicament</Text>
            <Text style={styles.tableCellHeader}>Instructions</Text>
          </View>

          {visite.medicaments.map((medicament, index) => (
            <View key={index} style={styles.tablebody}>
              <Text style={styles.tableCell}>{medicament.nom}</Text>
              <Text style={styles.tableCell}>{medicament.instructions}</Text>
            </View>
          ))}
        </View>

        {/* Bank Info */}
        <Text style={styles.banqueInfo}>
          En lettre : {visite.montantEnLettre} dirhams toutes taxes comprises{'\n'}
          Banque : CIH BANK{'\n'}
          SWIFT/BIC : CIHMMAMC{'\n'}
          IBAN : 230 780 3267249221026500 36
        </Text>

        {/* Signature */}
        <Text style={styles.signature}>
          ABDELLATIF TARHINE{'\n'}
          DIRECTEUR GENERAL
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.hr} />
          <Text style={styles.footerText}>
            ALEXSYS-SOLUTIONS - N° 37 , Allée des Eucalyptus Ain Sebâa Casablanca, Maroc
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
