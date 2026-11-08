import React from 'react';
import {
  Clock,
  ShowerHead,
  Tv,
  Wallet,
  Wifi,
  ShieldCheck,
  Coffee,
  Car,
  Sparkles,
  Utensils,
  Luggage,
  Wind,
  Flame,
  Sun,
  Heart,
  KeyRound,
  Bed,
  PhoneCall,
  Award,
  Zap,
  MapPin,
  Lock,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const AVAILABLE_SERVICE_ICONS: { id: string; name: string; category: string }[] = [
  { id: 'clock', name: 'Atención 24 Horas / Reloj', category: 'Recepción' },
  { id: 'shower', name: 'Baño Privado / Agua Caliente', category: 'Habitación' },
  { id: 'tv', name: 'TV Cable HD / Smart TV', category: 'Habitación' },
  { id: 'wallet', name: 'Pagos Yape / Tarjeta', category: 'Pagos' },
  { id: 'wifi', name: 'Wi-Fi de Alta Velocidad', category: 'Conectividad' },
  { id: 'shield', name: 'Custodia / Seguridad', category: 'Seguridad' },
  { id: 'coffee', name: 'Cafetería / Desayuno', category: 'Alimentos' },
  { id: 'car', name: 'Cochera / Estacionamiento', category: 'Transporte' },
  { id: 'sparkles', name: 'Limpieza / Sanitización', category: 'Higiene' },
  { id: 'utensils', name: 'Comedor / Restaurante', category: 'Alimentos' },
  { id: 'luggage', name: 'Guarda Equipaje', category: 'Servicio' },
  { id: 'wind', name: 'Ventilación / Clima', category: 'Habitación' },
  { id: 'flame', name: 'Calefacción / Calidez', category: 'Habitación' },
  { id: 'sun', name: 'Terraza / Vista', category: 'Instalaciones' },
  { id: 'heart', name: 'Paquete Romántico', category: 'Especial' },
  { id: 'key', name: 'Llave Segura / Acceso', category: 'Seguridad' },
  { id: 'bed', name: 'Cama Confortable', category: 'Habitación' },
  { id: 'phone', name: 'Llamadas / Recepción', category: 'Recepción' },
  { id: 'award', name: 'Calidad Garantizada', category: 'Garantía' },
  { id: 'zap', name: 'Carga Rápida / Energía', category: 'Instalaciones' }
];

interface ServiceIconProps {
  iconName: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ iconName, className = 'w-6 h-6 text-blue-900' }) => {
  switch (iconName?.toLowerCase()) {
    case 'clock':
      return <Clock className={className} />;
    case 'shower':
    case 'showerhead':
    case 'bath':
      return <ShowerHead className={className} />;
    case 'tv':
      return <Tv className={className} />;
    case 'wallet':
    case 'money':
    case 'payment':
      return <Wallet className={className} />;
    case 'wifi':
      return <Wifi className={className} />;
    case 'shield':
    case 'security':
      return <ShieldCheck className={className} />;
    case 'coffee':
      return <Coffee className={className} />;
    case 'car':
    case 'parking':
      return <Car className={className} />;
    case 'sparkles':
    case 'clean':
      return <Sparkles className={className} />;
    case 'utensils':
    case 'food':
      return <Utensils className={className} />;
    case 'luggage':
      return <Luggage className={className} />;
    case 'wind':
      return <Wind className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'sun':
      return <Sun className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'key':
      return <KeyRound className={className} />;
    case 'bed':
      return <Bed className={className} />;
    case 'phone':
      return <PhoneCall className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'map':
      return <MapPin className={className} />;
    case 'lock':
      return <Lock className={className} />;
    case 'check':
      return <CheckCircle2 className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
