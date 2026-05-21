import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { flexDirection: 'column', alignItems: 'center', marginBottom: 8, borderBottom: '2pt solid #1f7d45', paddingBottom: 4 },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1a6438', marginBottom: 2, textAlign: 'center' },
  subtitle: { fontSize: 11, color: '#333333', marginBottom: 2, textAlign: 'center' },
  docTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', backgroundColor: '#edfbf2', color: '#1a6438', padding: '4 8', borderRadius: 4, marginTop: 4 },
  section: { marginTop: 6, marginBottom: 0 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', backgroundColor: '#1f7d45', padding: '3 6', marginBottom: 3 },
  row: { flexDirection: 'row', marginBottom: 2, flexWrap: 'wrap' },
  col: { flex: 1, paddingRight: 10 },
  colHalf: { flex: 0.5, paddingRight: 10 },
  col2: { flex: 2, paddingRight: 10 },
  label: { fontSize: 9, color: '#666666', marginBottom: 2 },
  value: { fontSize: 10, color: '#000000', borderBottom: '1pt solid #eeeeee', paddingBottom: 2, minHeight: 14 },
  signatureContainer: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-around' },
  signatureBlock: { alignItems: 'center', width: 220 },
  signatureImage: { width: 200, height: 40, objectFit: 'contain' },
  signatureLine: { width: 200, borderTop: '1pt solid #000000', marginTop: 3, paddingTop: 3, textAlign: 'center' },
  signatureText: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  pageImageContainer: { alignItems: 'center', marginBottom: 15 },
  pageImageLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 4, color: '#1f7d45' },
  idImage: { width: 400, height: 240, objectFit: 'contain', border: '1pt solid #dddddd', borderRadius: 8 },
  committeeGrid: { flexDirection: 'row', marginTop: 30, paddingHorizontal: 20 },
  committeeBox: { flex: 1, marginHorizontal: 10, borderTop: '1pt solid #000000', paddingTop: 5, textAlign: 'center', fontSize: 10, fontFamily: 'Helvetica-Bold' }
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

export function PrestamoCorrientePDF({ data }: { data: any }) {
  let p: any = {};
  try { p = JSON.parse(data.dependientes || '{}'); } catch (e) {}

  return (
    <Document>
      {/* PAGE 1: Datos Personales + Fuente de Ingreso + Datos del Préstamo */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>COOPERATIVA DE AHORRO, CRÉDITO Y SERVICIOS MÚLTIPLES</Text>
          <Text style={styles.subtitle}>MARIANO ZARAGOZA.INC (COOPMAZA)</Text>
          <Text style={styles.subtitle}>Carrera de Palmas, La Vega.</Text>
          <Text style={styles.docTitle}>SOLICITUD DE PRESTAMO CORRIENTE</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.col}><Text style={styles.label}>Fecha</Text><Text style={styles.value}>{formatDate(data.fecha_solicitud)}</Text></View>
          <View style={styles.col}><Text style={styles.label}>Número de cuenta</Text><Text style={styles.value}>{p.numero_cuenta || '-'}</Text></View>
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
            <View style={styles.col}><Text style={styles.label}>Nacionalidad</Text><Text style={styles.value}>{p.nacionalidad || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Teléfono</Text><Text style={styles.value}>{data.telefonos || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Dirección</Text><Text style={styles.value}>{data.direccion || '-'}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II- FUENTE DE INGRESO</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Actividad a la que se dedica</Text><Text style={styles.value}>{p.actividad_dedica || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Tipo Ingreso</Text><Text style={styles.value}>{p.tipo_ingreso === 'negocio_propio' ? `Negocio: ${p.negocio_propio_especifique}` : p.tipo_ingreso || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Nombre Empresa</Text><Text style={styles.value}>{p.empresa_nombre || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Dirección y teléfono de la empresa</Text><Text style={styles.value}>{p.empresa_direccion_tel || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Ingreso mensual</Text><Text style={styles.value}>{p.ingreso_mensual ? `$${p.ingreso_mensual}` : '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Gastos fijos</Text><Text style={styles.value}>{p.gastos_fijos ? `$${p.gastos_fijos}` : '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Otros ingresos</Text><Text style={styles.value}>{p.otros_ingresos ? `$${p.otros_ingresos}` : '-'}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III- DATOS DEL PRÉSTAMO</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Monto en letras</Text><Text style={styles.value}>{p.monto_letras || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Monto del préstamo</Text><Text style={styles.value}>{p.monto_prestamo ? `$${p.monto_prestamo}` : '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Plazo del préstamo</Text><Text style={styles.value}>{p.plazo_prestamo || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Forma de pago</Text><Text style={styles.value}>{p.forma_pago || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Cantidad de acciones</Text><Text style={styles.value}>{p.cantidad_acciones || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Fines</Text><Text style={styles.value}>{p.fines || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Fecha de vencimiento</Text><Text style={styles.value}>{p.fecha_vencimiento || '-'}</Text></View>
          </View>
        </View>
      </Page>

      {/* PAGE 2: Referencias + Garante + Firmas + Comité */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IV- REFERENCIAS PERSONALES DEL SOCIO(A)</Text>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Nombres y Apellidos</Text><Text style={styles.value}>{p.ref_per_nombres || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Apodo</Text><Text style={styles.value}>{p.ref_per_apodo || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}><Text style={styles.label}>Dirección</Text><Text style={styles.value}>{p.ref_per_direccion || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Teléfono</Text><Text style={styles.value}>{p.ref_per_tel || '-'}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>V- REFERENCIAS COMERCIALES</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Nombres de la empresa</Text><Text style={styles.value}>{p.ref_com_empresa || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}><Text style={styles.label}>Dirección</Text><Text style={styles.value}>{p.ref_com_direccion || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Teléfono</Text><Text style={styles.value}>{p.ref_com_tel || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Tipo de empresa</Text><Text style={styles.value}>{p.ref_com_tipo || '-'}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VI- DATOS DE GARANTE O FIADOR SOLIDARIO</Text>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Nombres y apellidos</Text><Text style={styles.value}>{p.gar_nombres || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Apodo</Text><Text style={styles.value}>{p.gar_apodo || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Cédula</Text><Text style={styles.value}>{p.gar_cedula || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Nacionalidad</Text><Text style={styles.value}>{p.gar_nacionalidad || '-'}</Text></View>
            <View style={styles.colHalf}><Text style={styles.label}>Sexo</Text><Text style={styles.value}>{p.gar_sexo === 'm' ? 'M' : p.gar_sexo === 'f' ? 'F' : '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Estado Civil</Text><Text style={styles.value}>{p.gar_estado_civil || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Teléfono</Text><Text style={styles.value}>{p.gar_tel || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Dirección</Text><Text style={styles.value}>{p.gar_direccion || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Nombre de la empresa donde labora</Text><Text style={styles.value}>{p.gar_empresa_labora || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}><Text style={styles.label}>Dirección empresa</Text><Text style={styles.value}>{p.gar_empresa_direccion || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Tel Empresa</Text><Text style={styles.value}>{p.gar_empresa_tel || '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Tiempo en la empresa</Text><Text style={styles.value}>{p.gar_tiempo_empresa || '-'}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Text style={styles.label}>Ingreso mensual</Text><Text style={styles.value}>{p.gar_ingreso_mensual ? `$${p.gar_ingreso_mensual}` : '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Gastos fijos</Text><Text style={styles.value}>{p.gar_gastos_fijos ? `$${p.gar_gastos_fijos}` : '-'}</Text></View>
            <View style={styles.col}><Text style={styles.label}>Otros ingresos</Text><Text style={styles.value}>{p.gar_otros_ingresos ? `$${p.gar_otros_ingresos}` : '-'}</Text></View>
          </View>
        </View>

        {/* Firmas */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureBlock}>
            {data.firma_url ? <Image src={data.firma_url} style={styles.signatureImage} /> : <View style={styles.signatureImage}></View>}
            <View style={styles.signatureLine}><Text style={styles.signatureText}>Firma y cédula del soci@</Text></View>
          </View>
          <View style={styles.signatureBlock}>
            {p.firma_garante_url ? <Image src={p.firma_garante_url} style={styles.signatureImage} /> : <View style={styles.signatureImage}></View>}
            <View style={styles.signatureLine}><Text style={styles.signatureText}>Firma y cédula Garante</Text></View>
          </View>
        </View>

        {/* Comité */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>VII- COMITÉ DE CRÉDITO U ORGANISMO AUTORIZADO</Text>
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

      {/* PAGE 3: Cédula del Socio */}
      {(data.cedula_frontal_url || data.cedula_trasera_url) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>ANEXO DE IDENTIFICACIÓN - SOCIO(A)</Text>
          </View>
          {data.cedula_frontal_url && (
            <View style={[styles.pageImageContainer, { marginTop: 30 }]}>
              <Text style={styles.pageImageLabel}>CÉDULA FRONTAL</Text>
              <Image src={data.cedula_frontal_url} style={styles.idImage} />
            </View>
          )}
          {data.cedula_trasera_url && (
            <View style={[styles.pageImageContainer, { marginTop: 20 }]}>
              <Text style={styles.pageImageLabel}>CÉDULA TRASERA</Text>
              <Image src={data.cedula_trasera_url} style={styles.idImage} />
            </View>
          )}
        </Page>
      )}

      {/* PAGE 4: Cédula del Garante */}
      {(p.cedula_garante_frontal_url || p.cedula_garante_trasera_url) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>ANEXO DE IDENTIFICACIÓN - GARANTE</Text>
          </View>
          {p.cedula_garante_frontal_url && (
            <View style={[styles.pageImageContainer, { marginTop: 30 }]}>
              <Text style={styles.pageImageLabel}>CÉDULA FRONTAL</Text>
              <Image src={p.cedula_garante_frontal_url} style={styles.idImage} />
            </View>
          )}
          {p.cedula_garante_trasera_url && (
            <View style={[styles.pageImageContainer, { marginTop: 20 }]}>
              <Text style={styles.pageImageLabel}>CÉDULA TRASERA</Text>
              <Image src={p.cedula_garante_trasera_url} style={styles.idImage} />
            </View>
          )}
        </Page>
      )}
    </Document>
  );
}
