import { Car, Tv, Building2, Briefcase, GraduationCap, CircleDollarSign, type LucideIcon } from 'lucide-react';

export interface LoanType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const LOAN_TYPES: LoanType[] = [
  {
    id: 'vehiculos',
    title: 'Préstamo de Vehículos',
    description: 'Financia la compra del vehículo que necesitas con tasas competitivas.',
    icon: Car,
  },
  {
    id: 'electrodomesticos',
    title: 'Préstamo para Electrodomésticos',
    description: 'Equipa tu hogar con lo mejor. Fácil, rápido y seguro.',
    icon: Tv,
  },
  {
    id: 'mipymes',
    title: 'Préstamo para MIPYMES',
    description: 'Impulsa tu negocio con el financiamiento que tu empresa necesita.',
    icon: Building2,
  },
  {
    id: 'gerencial',
    title: 'Préstamo Gerencial',
    description: 'Soluciones financieras diseñadas para tus proyectos y objetivos.',
    icon: Briefcase,
  },
  {
    id: 'escolar',
    title: 'Préstamo Escolar',
    description: 'Invierte en educación y construye un mejor futuro.',
    icon: GraduationCap,
  },
  {
    id: 'corriente',
    title: 'Préstamo Corriente',
    description: 'Para tus necesidades del día a día, de forma rápida y sencilla.',
    icon: CircleDollarSign,
  },
];

export function getLoanTypeById(id: string): LoanType | undefined {
  return LOAN_TYPES.find(l => l.id === id);
}
