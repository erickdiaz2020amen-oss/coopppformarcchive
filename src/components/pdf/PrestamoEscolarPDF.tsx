import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
    borderBottom: '2pt solid #1f7d45',
    paddingBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1a6438',
    marginBottom: 2,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 2,
    letterSpacing: 1,
    textAlign: 'center'
  },
  docTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#edfbf2',
    color: '#1a6438',
    padding: '4 8',
    borderRadius: 4,
    marginTop: 4,
  },
  section: {
    marginTop: 6,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    backgroundColor: '#1f7d45',
    padding: '3 6',
    marginBottom: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
    flexWrap: 'wrap'
  },
  col: {
    flex: 1,
    paddingRight: 10,
  },
  colHalf: {
    flex: 0.5,
    paddingRight: 10,
  },
  label: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: '#000000',
    borderBottom: '1pt solid #eeeeee',
    paddingBottom: 2,
    minHeight: 14,
  },
  signatureContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  signatureImage: {
    width: 350,
    height: 50,
    objectFit: 'contain',
  },
  signatureLine: {
    width: 350,
    borderTop: '1pt solid #000000',
    marginTop: 3,
    paddingTop: 3,
    textAlign: 'center',
  },
  signatureText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  page2ImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  page2ImageLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#1f7d45'
  },
  idImage: {
    width: 400,
    height: 250,
    objectFit: 'contain',
    border: '1pt solid #dddddd',
    borderRadius: 8,
  },
  committeeGrid: {
    flexDirection: 'row',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  committeeBox: {
    flex: 1,
    marginHorizontal: 10,
    borderTop: '1pt solid #000000',
    paddingTop: 5,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  }
});

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [_, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

export function PrestamoEscolarPDF({ data }: { data: any }) {
  let prestamoData: any = {};
  try {
    prestamoData = JSON.parse(data.dependientes || '{}');
  } catch (e) {}

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>COOPERATIVA DE AHORRO, CRÉDITO Y SERVICIOS MÚLTIPLES</Text>
          <Text style={[styles.title, { marginBottom: 2 }]}>MARIANO ZARAGOZA.INC (COOPMAZA)</Text>
          <Text style={styles.subtitle}>RNC 430-35571-2. Con domicilio en Carrera de Palmas, La Vega.</Text>
          <Text style={styles.docTitle}>SOLICITUD DE PRÉSTAMO ESCOLAR / ÚTILES ESCOLARES.</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Fecha de Solicitud</Text>
            <Text style={styles.value}>{formatDate(data.fecha_solicitud)}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Número de cuenta</Text>
            <Text style={styles.value}>{prestamoData.numero_cuenta || '-'}</Text>
          </View>
          <View style={styles.col}></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I- DATOS PERSONALES</Text>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Nombres</Text><Text style={styles.value}>{data.nombres}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Apellidos</Text><Text style={styles.value}>{data.apellidos !== 'N/A' ? data.apellidos : '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Apodo</Text><Text style={styles.value}>{data.apellidos !== 'N/A' ? data.apellidos : '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Cédula</Text><Text style={styles.value}>{data.cedula}</Text></View>
            <View style={styles.colHalf}><Text style={styles.label}>Sexo</Text><Text style={styles.value}>{data.sexo === 'm' ? 'M' : 'F'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Estado Civil</Text><Text style={styles.value}>{data.estado_civil || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Nacionalidad</Text><Text style={styles.value}>{prestamoData.nacionalidad || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Teléfono</Text><Text style={styles.value}>{data.telefonos || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Dirección</Text><Text style={styles.value}>{data.direccion || '-'}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II- DATOS DEL PRÉSTAMO</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Monto en letras</Text><Text style={styles.value}>{prestamoData.monto_letras || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Monto del préstamo</Text><Text style={styles.value}>{prestamoData.monto_prestamo ? `$${prestamoData.monto_prestamo}` : '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Plazo del préstamo</Text><Text style={styles.value}>{prestamoData.plazo_prestamo || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Forma de pago</Text><Text style={styles.value}>{prestamoData.forma_pago || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Cantidad de acciones</Text><Text style={styles.value}>{prestamoData.cantidad_acciones || '-'}</Text></View>
          </View>
        </View>

        <View style={styles.signatureContainer} wrap={false}>
          {data.firma_url ? (
            <Image src={data.firma_url} style={styles.signatureImage} />
          ) : (
            <View style={styles.signatureImage}></View>
          )}
          <View style={styles.signatureLine}>
            <Text style={styles.signatureText}>Firma del Solicitante</Text>
          </View>
        </View>

        <View style={[styles.section, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>III- COMITÉ DE CRÉDITO U ORGANISMO AUTORIZADO</Text>
          <View style={styles.row}>
            <View style={styles.colHalf}><Text style={styles.label}>Fecha</Text><Text style={styles.value}></Text></View>
            <View style={styles.col}></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Monto aprobado</Text><Text style={styles.value}></Text></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Observaciones</Text><Text style={styles.value}></Text></View>
          </View>

          <View style={styles.committeeGrid}>
            <Text style={styles.committeeBox}>Presidente</Text>
            <Text style={styles.committeeBox}>Secretari@</Text>
            <Text style={styles.committeeBox}>Primer vocal</Text>
          </View>
        </View>
      </Page>
      
      {(data.cedula_frontal_url || data.cedula_trasera_url) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>ANEXOS DE IDENTIFICACIÓN</Text>
            <Text style={styles.subtitle}>{data.nombres} {data.apellidos !== 'N/A' ? data.apellidos : ''} - {data.cedula}</Text>
          </View>

          {data.cedula_frontal_url && (
            <View style={styles.page2ImageContainer}>
              <Text style={styles.page2ImageLabel}>CÉDULA (FRONTAL)</Text>
              <Image src={data.cedula_frontal_url} style={styles.idImage} />
            </View>
          )}

          {data.cedula_trasera_url && (
            <View style={styles.page2ImageContainer}>
              <Text style={styles.page2ImageLabel}>CÉDULA (TRASERA)</Text>
              <Image src={data.cedula_trasera_url} style={styles.idImage} />
            </View>
          )}
        </Page>
      )}
    </Document>
  );
}
