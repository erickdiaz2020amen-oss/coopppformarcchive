import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '2pt solid #1f7d45',
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1a6438',
    marginBottom: 4,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 4,
    letterSpacing: 1,
    textAlign: 'center'
  },
  docTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#edfbf2',
    color: '#1a6438',
    padding: '6 12',
    borderRadius: 4,
    marginTop: 8,
  },
  section: {
    marginTop: 15,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    backgroundColor: '#1f7d45',
    padding: '4 8',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
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
    marginTop: 20,
    alignItems: 'center',
  },
  signatureImage: {
    width: 350,
    height: 100,
    objectFit: 'contain',
  },
  signatureLine: {
    width: 350,
    borderTop: '1pt solid #000000',
    marginTop: 5,
    paddingTop: 5,
    textAlign: 'center',
  },
  signatureText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  page2ImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  page2ImageLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#1f7d45'
  },
  idImage: {
    width: 400,
    height: 250,
    objectFit: 'contain',
    border: '1pt solid #dddddd',
    borderRadius: 8,
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

export const SolicitudPDF = ({ data }: { data: any }) => (
  <Document>
    {/* PAGE 1: Form Data */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>COOPERATIVA DE AHORRO, CRÉDITO Y SERVICIOS MÚLTIPLES</Text>
        <Text style={styles.subtitle}>COOPMAZA</Text>
        <Text style={styles.docTitle}>SOLICITUD DE ADMISIÓN</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Fecha de Solicitud</Text>
          <Text style={styles.value}>{formatDate(data.fecha_solicitud)}</Text>
        </View>
        <View style={styles.col}></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>
        <View style={styles.row}>
          <View style={styles.col}><Text style={styles.label}>Nombres</Text><Text style={styles.value}>{data.nombres}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Apellidos</Text><Text style={styles.value}>{data.apellidos}</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}><Text style={styles.label}>Cédula</Text><Text style={styles.value}>{data.cedula}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Fecha Nacimiento</Text><Text style={styles.value}>{formatDate(data.fecha_nacimiento)}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Estado Civil</Text><Text style={styles.value}>{data.estado_civil || '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Sexo</Text><Text style={styles.value}>{data.sexo === 'm' ? 'Masculino' : data.sexo === 'f' ? 'Femenino' : '-'}</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.col2}><Text style={styles.label}>Dirección</Text><Text style={styles.value}>{data.direccion || '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Ciudad</Text><Text style={styles.value}>{data.ciudad || '-'}</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}><Text style={styles.label}>Provincia</Text><Text style={styles.value}>{data.provincia || '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Teléfonos</Text><Text style={styles.value}>{data.telefonos || '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>E-Mail</Text><Text style={styles.value}>{data.email || '-'}</Text></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATOS LABORALES</Text>
        <View style={styles.row}>
          <View style={styles.col2}><Text style={styles.label}>Empresa</Text><Text style={styles.value}>{data.empresa || '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Cód. Empleado</Text><Text style={styles.value}>{data.codigo_empleado || '-'}</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.col2}><Text style={styles.label}>Dirección</Text><Text style={styles.value}>{data.direccion_empresa || '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Depto.</Text><Text style={styles.value}>{data.departamento || '-'}</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}><Text style={styles.label}>Cargo/Ocupación</Text><Text style={styles.value}>{data.cargo || '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Salario</Text><Text style={styles.value}>{data.salario ? `$${data.salario}` : '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Fecha Ingreso</Text><Text style={styles.value}>{formatDate(data.fecha_ingreso)}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Aporte Mensual</Text><Text style={styles.value}>{data.aporte_mensual ? `$${data.aporte_mensual}` : '-'}</Text></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATOS DEL CÓNYUGE</Text>
        <View style={styles.row}>
          <View style={styles.col2}><Text style={styles.label}>Nombre</Text><Text style={styles.value}>{data.conyuge || '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Ocupación</Text><Text style={styles.value}>{data.ocupacion_conyuge || '-'}</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}><Text style={styles.label}>Salario</Text><Text style={styles.value}>{data.salario_conyuge ? `$${data.salario_conyuge}` : '-'}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Fecha Nacimiento</Text><Text style={styles.value}>{formatDate(data.fecha_nacimiento_conyuge)}</Text></View>
          <View style={styles.col}></View>
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
    </Page>

    {/* PAGE 2: Images */}
    {(data.cedula_frontal_url || data.cedula_trasera_url) && (
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>ANEXOS DE IDENTIFICACIÓN</Text>
          <Text style={styles.subtitle}>{data.nombres} {data.apellidos} - {data.cedula}</Text>
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
