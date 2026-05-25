import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 5,
    borderBottom: '2pt solid #1f7d45',
    paddingBottom: 2,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1a6438',
    marginBottom: 1,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 1,
    letterSpacing: 1,
    textAlign: 'center'
  },
  docTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#edfbf2',
    color: '#1a6438',
    padding: '3 6',
    borderRadius: 4,
    marginTop: 2,
  },
  section: {
    marginTop: 4,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    backgroundColor: '#1f7d45',
    padding: '2 4',
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 1,
    flexWrap: 'wrap'
  },
  col: {
    flex: 1,
    paddingRight: 10,
  },
  col2: {
    flex: 2,
    paddingRight: 10,
  },
  col3: {
    flex: 3,
    paddingRight: 10,
  },
  colHalf: {
    flex: 0.5,
    paddingRight: 10,
  },
  col1_5: {
    flex: 1.5,
    paddingRight: 10,
  },
  label: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 1,
  },
  value: {
    fontSize: 8,
    color: '#000000',
    borderBottom: '1pt solid #eeeeee',
    paddingBottom: 1,
    minHeight: 12,
  },
  signatureContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  signatureImage: {
    width: 350,
    height: 40,
    objectFit: 'contain',
  },
  signatureLine: {
    width: 350,
    borderTop: '1pt solid #000000',
    marginTop: 2,
    paddingTop: 2,
    textAlign: 'center',
  },
  signatureText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  page2ImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  page2ImageLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    color: '#1f7d45'
  },
  idImage: {
    width: 400,
    height: 230,
    objectFit: 'contain',
    border: '1pt solid #dddddd',
    borderRadius: 8,
  },
  committeeGrid: {
    flexDirection: 'row',
    marginTop: 25,
    paddingHorizontal: 20,
  },
  committeeBox: {
    flex: 1,
    marginHorizontal: 10,
    borderTop: '1pt solid #000000',
    paddingTop: 4,
    textAlign: 'center',
    fontSize: 9,
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

export function PrestamoVehiculoPDF({ data }: { data: any }) {
  let prestamoData: any = {};
  try {
    prestamoData = JSON.parse(data.dependientes || '{}');
  } catch (e) {}

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>COOPERATIVA DE AHORRO, CRÉDITO Y SERVICIOS MÚLTIPLES</Text>
          <Text style={styles.subtitle}>COOPMAZA</Text>
          <Text style={styles.docTitle}>SOLICITUD DE PRÉSTAMO DE VEHÍCULOS</Text>
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
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Número de cotización</Text><Text style={styles.value}>{prestamoData.numero_cotizacion || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Artículo seleccionado</Text><Text style={styles.value}>{prestamoData.articulo_seleccionado || '-'}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III- REFERENCIAS PERSONALES DEL SOCIO(A)</Text>
          <View style={styles.row}>
            <View style={styles.col2}><Text style={styles.label}>Nombres y Apellidos</Text><Text style={styles.value}>{prestamoData.ref_per_nombres || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Apodo</Text><Text style={styles.value}>{prestamoData.ref_per_apodo || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}><Text style={styles.label}>Dirección</Text><Text style={styles.value}>{prestamoData.ref_per_direccion || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Teléfono</Text><Text style={styles.value}>{prestamoData.ref_per_tel || '-'}</Text></View>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IV- COMITÉ DE CRÉDITO U ORGANISMO AUTORIZADO</Text>
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
