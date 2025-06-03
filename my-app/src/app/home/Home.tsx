'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PasswordRecoveryModal from '../components/auth/authRecuperarContrasena/PasswordRecoveryModal';
import CodeVerificationModal from '../components/auth/authRecuperarContrasena/CodeVerificationModal';
import NewPasswordModal from '../components/auth/authRecuperarContrasena/NewPasswordModal';
import LoginModal from '../components/auth/authInicioSesion/LoginModal';
import RegisterModal from '../components/auth/authregistro/RegisterModal';
import ModalLoginExitoso from '@/app/components/modals/ModalLoginExitoso';
import CompleteProfileModal from '@/app/components/auth/authregistro/CompleteProfileHost';
import { jwtDecode } from 'jwt-decode';
import Carousel from '../components/carousel/Carrusel';

// Componente separado que maneja useSearchParams
function SearchParamsHandler({
  setActiveModal,
  setShowCompleteProfileModal
}: {
  setActiveModal: (modal: 'login' | 'register' | null) => void;
  setShowCompleteProfileModal: (show: boolean) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('googleComplete') === 'true') {
      setActiveModal('register');
    }
  }, [searchParams, setActiveModal]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token) as {
          idUsuario: number,
          email: string,
          nombreCompleto?: string,
          fechaNacimiento?: string
        };
  
        if (decoded.idUsuario === -1) {
          localStorage.setItem('google_email', decoded.email);
          setShowCompleteProfileModal(true);
        } else {
          // LIMPIAR DATOS OBSOLETOS ANTES DE GUARDAR NUEVOS
          localStorage.removeItem('userDriverStatus');
          localStorage.removeItem('userHostStatus');
          
          localStorage.setItem('token', token);
          localStorage.setItem('nombreCompleto', decoded.nombreCompleto || '');
          localStorage.setItem('loginSuccess', 'true');
  
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          window.history.replaceState({}, '', url.toString());
          window.location.reload();
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, [searchParams, setShowCompleteProfileModal]);

  return null;
}

// Componente principal del contenido
function HomePageContent() {
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);
  const [modalState, setModalState] = useState<'passwordRecovery' | 'codeVerification' | 'newPassword' | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [showToast2, setShowToast2] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);

  const handleLoginSubmit = () => setModalState('passwordRecovery');
  const handlePasswordRecoverySubmit = () => setModalState('codeVerification');
  const handleCodeVerificationSubmit = () => setModalState('newPassword');
  const handleClose = () => {
    setModalState(null);
    setActiveModal('login');
  };
  const handleBackToPasswordRecovery = () => setModalState('passwordRecovery');

  const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);

  useEffect(() => {
    const registroDriver = localStorage.getItem('registroDriver');
    if(registroDriver === '1'){
      localStorage.removeItem('registroDriver');
      window.location.reload();
    }
  });

  useEffect(() => {
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
      setShowLoginSuccessModal(true);
      localStorage.removeItem('loginSuccess');
    }
  }, []);

  return (
    <>
    <div>
      <Carousel/>
    </div>
      {/* Envolver SearchParamsHandler en Suspense */}
      <Suspense fallback={null}>
        <SearchParamsHandler 
          setActiveModal={setActiveModal}
          setShowCompleteProfileModal={setShowCompleteProfileModal}
        />
      </Suspense>

      {modalState === 'passwordRecovery' && (
        <PasswordRecoveryModal
          onClose={handleClose}
          onPasswordRecoverySubmit={handlePasswordRecoverySubmit}
        />
      )}
      {modalState === 'codeVerification' && (
        <CodeVerificationModal
          onClose={handleBackToPasswordRecovery}
          onCodeVerificationSubmit={handleCodeVerificationSubmit}
          onBlocked={() => {
            setModalState(null);
            setActiveModal('login');
            setShowToast2(true);
            setTimeout(() => setShowToast2(false), 10000);
          }}
        />
      )}
      {modalState === 'newPassword' && (
        <NewPasswordModal
          onClose={handleClose}
          code="exampleCode"
          onNewPasswordSubmit={() => {
            setModalState(null);
            setActiveModal('login');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 10000);
          }}
        />
      )}
      {activeModal === 'login' && (
        <LoginModal
          onClose={() => setActiveModal(null)}
          onRegisterClick={() => setActiveModal('register')}
          onPasswordRecoveryClick={handleLoginSubmit}
        />
      )}
      {activeModal === 'register' && (
        <RegisterModal
          onClose={() => setActiveModal(null)}
          onLoginClick={() => setActiveModal('login')}
        />
      )}

      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          ¡Contraseña actualizada correctamente!
        </div>
      )}
      {showToast2 && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          Usuario bloqueado temporalmente. Intenta nuevamente más tarde.
        </div>
      )}
      {showLoginSuccessModal && (
        <ModalLoginExitoso onClose={() => setShowLoginSuccessModal(false)} />
      )}

      {showCompleteProfileModal && (
        <CompleteProfileModal
          onComplete={() => {
            setShowCompleteProfileModal(false);
            window.location.href = "/home";
          }}
          onClose={() => {
            setShowCompleteProfileModal(false);
            window.location.href = "/";
          }}
        />
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HomePageContent />
    </Suspense>
  );
}