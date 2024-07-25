import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import moment from 'moment';

Font.register({ family: 'Roboto', src:'http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf' });

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
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#000',
    borderBottomWidth: '1pt',
    paddingBottom: '8px',
  },
  tablebody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '8px',
    paddingTop: '15px',
  },
  tableCell: {
    width: '75px',
    fontSize: '10pt',
    fontWeight: 'bold',
    color: '#000000',
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

export const Invoice = ({ client, facture, projet }) => {
  const formattedDate = moment(facture.created_at).format('DD/MM/YYYY');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.titre}>ALEXSYS</Text>
        <Text style={styles.sTitre}>SOLUTIONS</Text>
        <Text style={styles.titre2}>FACTURE</Text>

        {/* Company Info */}
        <Text style={styles.info}>
          N° 37 , Allée des Eucalyptus Ain Sebâa Casablanca , Maroc{'\n'}
          Téléphone : +212 5 22 35 34 24{'\n'}
          Email : Contact@Alexsys.Solutions
        </Text>

        {/* Client Info */}
        <Text style={styles.infoClient}>
          Á L’ATTENTION DE :{'\n'}
          {client.raison_sociale}, {client.adresse}
        </Text>

        {/* Facture Info */}
        <Text style={styles.infoFac}>
          FAC N° : {facture.id}{'\n'}
          DATE : {formattedDate}{'\n'}
          Référence : {facture.reference}
        </Text>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>DÉSIGNATION</Text>
            <Text style={styles.tableCell}>Unité</Text>
            {projet.mode_facturation === 'JH' && (
              <>
                <Text style={styles.tableCell}>Quantité</Text>
                <Text style={styles.tableCell}>Prix unitaire HT (Dhs)</Text>
              </>
            )}
            <Text style={styles.tableCell}>Total HT (Dhs)</Text>
            <Text style={styles.tableCell}>Total TVA</Text>
            <Text style={styles.tableCell}>TOTAL TTC</Text>
          </View>
          <View style={styles.tablebody}>
            <Text style={styles.tableCell}>{projet.designiation}</Text>
            <Text style={styles.tableCell}>{projet.mode_facturation}</Text>
            {projet.mode_facturation === 'JH' && (
              <>
                <Text style={styles.tableCell}>{facture.quantite}</Text>
                <Text style={styles.tableCell}>{facture.prix_unitaire}</Text>
              </>
            )}
            <Text style={styles.tableCell}>{facture.total_ht}</Text>
            <Text style={styles.tableCell}>{facture.total_tva}</Text>
            <Text style={styles.tableCell}>{facture.total_ttc}</Text>
          </View>
        </View>

        {/* Bank Info */}
        <Text style={styles.banqueInfo}>
          En lettre : {facture.numword} dirhams toutes taxes comprises{'\n'}
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
          <Text>
            <Text style={styles.footerText}>ALEXSYS-SOLUTIONS - N° 37 , All</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
