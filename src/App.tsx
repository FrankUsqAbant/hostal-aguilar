/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RoomsSection } from './components/RoomsSection';
import { ServicesSection } from './components/ServicesSection';
import { LocationAndReviews } from './components/LocationAndReviews';
import { ContactBanner } from './components/ContactBanner';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { LibroReclamacionesModal } from './components/LibroReclamacionesModal';
import { LegalModal } from './components/LegalModal';
import { FaqModal } from './components/FaqModal';
import { WhatsAppFloatingWidget } from './components/WhatsAppFloatingWidget';
import { AdminPortal } from './components/admin/AdminPortal';
import { Room, RoomType } from './types';

export default function App() {
  // Routing state for dedicated Admin tab/page view
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.search.includes('view=admin');
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#admin' || window.location.search.includes('view=admin'));
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleBackToSite = () => {
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    setIsAdminRoute(false);
  };

  // Modal states for main website
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [bookingDate, setBookingDate] = useState<string | undefined>(undefined);
  const [bookingRoomType, setBookingRoomType] = useState<RoomType | undefined>(undefined);

  const [isLibroOpen, setIsLibroOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  
  const [legalModalState, setLegalModalState] = useState<{
    isOpen: boolean;
    title: string;
    section: 'privacidad' | 'terminos' | 'reglamento' | 'cancelacion' | 'deslinde';
  }>({
    isOpen: false,
    title: '',
    section: 'privacidad'
  });

  const handleOpenBooking = () => {
    setSelectedRoomForBooking(null);
    setIsBookingOpen(true);
  };


  const handleSelectRoomForBooking = (room: Room) => {
    setSelectedRoomForBooking(room);
    setBookingRoomType(room.type);
    setIsBookingOpen(true);
  };

  const handleOpenLegal = (
    title: string,
    section: 'privacidad' | 'terminos' | 'reglamento' | 'cancelacion' | 'deslinde'
  ) => {
    setLegalModalState({
      isOpen: true,
      title,
      section
    });
  };

  // If URL hash is #admin, render the full-page dedicated Admin Portal
  if (isAdminRoute) {
    return <AdminPortal onBackToSite={handleBackToSite} />;
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col antialiased">
      {/* Top Header */}
      <Header onOpenBooking={handleOpenBooking} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with interactive booking bar */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* Rooms Showcase */}
        <RoomsSection onSelectRoomForBooking={handleSelectRoomForBooking} />

        {/* Services & Amenities (Dynamic from Admin) */}
        <ServicesSection />

        {/* Strategic Location & Guest Testimonials */}
        <LocationAndReviews />

        {/* 24/7 Contact Banner Strip */}
        <ContactBanner onOpenBooking={handleOpenBooking} />
      </main>

      {/* Comprehensive 4-Column Footer with Admin Portal Access */}
      <Footer
        onOpenLibroReclamaciones={() => setIsLibroOpen(true)}
        onOpenLegal={handleOpenLegal}
        onOpenFaq={() => setIsFaqOpen(true)}
      />

      {/* Persistent Bottom-Right WhatsApp Floating Widget */}
      <WhatsAppFloatingWidget />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialRoom={selectedRoomForBooking}
        initialDate={bookingDate}
        initialRoomType={bookingRoomType}
      />

      <LibroReclamacionesModal
        isOpen={isLibroOpen}
        onClose={() => setIsLibroOpen(false)}
      />

      <LegalModal
        isOpen={legalModalState.isOpen}
        onClose={() => setLegalModalState(prev => ({ ...prev, isOpen: false }))}
        title={legalModalState.title}
        section={legalModalState.section}
      />

      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />
    </div>
  );
}
