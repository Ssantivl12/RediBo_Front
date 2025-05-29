<<<<<<< HEAD
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ✅
import Navbar from "../components/navbar/Navbar";
import FiltersBar from "../components/filters/FiltersBar";
import Footer from "../components/footer/Footer";
import PasswordRecoveryModal from "../components/auth/authRecuperarContrasena/PasswordRecoveryModal";
import CodeVerificationModal from "../components/auth/authRecuperarContrasena/CodeVerificationModal";
import NewPasswordModal from "../components/auth/authRecuperarContrasena/NewPasswordModal";
import LoginModal from "../components/auth/authInicioSesion/LoginModal";
import styles from "./Home.module.css";
import RegisterModal from "../components/auth/authregistro/RegisterModal";
import CompleteProfileModal from "@/app/components/auth/authregistro/CompleteProfileModal";

=======
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PasswordRecoveryModal from '../components/auth/authRecuperarContrasena/PasswordRecoveryModal';
import CodeVerificationModal from '../components/auth/authRecuperarContrasena/CodeVerificationModal';
import NewPasswordModal from '../components/auth/authRecuperarContrasena/NewPasswordModal';
import LoginModal from '../components/auth/authInicioSesion/LoginModal';
import RegisterModal from '../components/auth/authregistro/RegisterModal';
>>>>>>> a08fe236ade62a22768ba9abbdab165dd3a2a256
import ModalLoginExitoso from '@/app/components/modals/ModalLoginExitoso';
import CompleteProfileModal from '@/app/components/auth/authregistro/CompleteProfileHost';
import { jwtDecode } from 'jwt-decode';

// Componente separado que maneja useSearchParams
function SearchParamsHandler({
  setActiveModal,
  setShowCompleteProfileModal
}: {
  setActiveModal: (modal: 'login' | 'register' | null) => void;
  setShowCompleteProfileModal: (show: boolean) => void;
}) {
  const searchParams = useSearchParams();
const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [hasRedirected, setHasRedirected] = useState(false); // 👈 Evita doble redirect

<<<<<<< HEAD
  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [modalState, setModalState] = useState<
    "passwordRecovery" | "codeVerification" | "newPassword" | null
  >(null);
  const [showToast, setShowToast] = useState(false);
  const [showToast2, setShowToast2] = useState(false); // Para el mensaje de usuario bloqueado
  
  const handleLoginSubmit = () => {
    setModalState("passwordRecovery");
  };

  const handlePasswordRecoverySubmit = () => {
    setModalState("codeVerification");
  };

  const handleCodeVerificationSubmit = () => {
    setModalState("newPassword");
  };

  const handleClose = () => {
    setModalState(null); // Cierra cualquier modal de recuperación
    setActiveModal("login"); // Abre el login modal
  };

  const handleBackToPasswordRecovery = () => {
    setModalState("passwordRecovery"); // Regresa al PasswordRecoveryModal desde el CodeVerificationModal
  };

  useEffect(() => {
     /* const params = new URLSearchParams(window.location.search); */
    const autoLogin = searchParams.get("googleAutoLogin");
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const googleComplete = searchParams.get("googleComplete");
    const shouldOpen = localStorage.getItem("openCompleteProfileModal");

    if (autoLogin === "true" && token && email && !hasRedirected) {
      console.log("🌐 Detectado login automático en /home. Redirigiendo...");

      localStorage.setItem("token", token);
      localStorage.setItem("google_email", email);

      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("googleAutoLogin");
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("email");
      window.history.replaceState({}, "", cleanUrl.toString());

      setHasRedirected(true);
      window.location.href = "/home/homePage"; // ✅ solo desde aquí
    }

    if (googleComplete === "true" && shouldOpen === "true") {
      if (token && email) {
        localStorage.setItem("token", token);
        localStorage.setItem("google_email", email);
      }
      console.log("🧩 Mostrar CompleteProfileModal desde /home");
      setShowCompleteProfileModal(true);
      localStorage.removeItem("openCompleteProfileModal");

      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("googleComplete");
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("email");
      window.history.replaceState({}, "", cleanUrl.toString());
    }

  }, [searchParams, hasRedirected]);
=======
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
>>>>>>> a08fe236ade62a22768ba9abbdab165dd3a2a256

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
<<<<<<< HEAD
    
    <div className={styles.container}>
      <header className={styles.headerTop}>
        <Navbar 
          onLoginClick={() => setActiveModal("login")}
          onRegisterClick={() => setActiveModal("register")}
=======
    <>
      {/* Envolver SearchParamsHandler en Suspense */}
      <Suspense fallback={null}>
        <SearchParamsHandler 
          setActiveModal={setActiveModal}
          setShowCompleteProfileModal={setShowCompleteProfileModal}
>>>>>>> a08fe236ade62a22768ba9abbdab165dd3a2a256
        />
      </Suspense>

<<<<<<< HEAD
      <header className={styles.headerFilters}>
        <FiltersBar />
      </header>

      <main className={styles.body}>
        <div className={styles.scrollContent}>
          <p>Contenido principal del usuario (tarjetas, información, etc.).</p>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>

      {/* Mostrar los modales según el estado */}
      {/*{modalState === 'login' && (
        <LoginModal onClose={handleClose} onLoginSubmit={handleLoginSubmit} />
      )}*/}
      {modalState === "passwordRecovery" && (
=======
      {modalState === 'passwordRecovery' && (
>>>>>>> a08fe236ade62a22768ba9abbdab165dd3a2a256
        <PasswordRecoveryModal
          onClose={handleClose}
          onPasswordRecoverySubmit={handlePasswordRecoverySubmit}
        />
      )}
      {modalState === "codeVerification" && (
        <CodeVerificationModal
<<<<<<< HEAD
        onClose={handleBackToPasswordRecovery}
        onCodeVerificationSubmit={handleCodeVerificationSubmit}
        onBlocked={() => {
          setModalState(null);
          setActiveModal("login"); // Redirige al Login al finalizar
          setShowToast2(true); // muestra el pop-up

            // Ocultar el toast automáticamente después de 3 segundos
=======
          onClose={handleBackToPasswordRecovery}
          onCodeVerificationSubmit={handleCodeVerificationSubmit}
          onBlocked={() => {
            setModalState(null);
            setActiveModal('login');
            setShowToast2(true);
>>>>>>> a08fe236ade62a22768ba9abbdab165dd3a2a256
            setTimeout(() => setShowToast2(false), 10000);
          }}
        />
      )}
      {modalState === "newPassword" && (
        <NewPasswordModal
          onClose={handleClose}
          code="exampleCode"
          onNewPasswordSubmit={() => {
            setModalState(null);
<<<<<<< HEAD
            setActiveModal("login"); // Redirige al Login al finalizar
            setShowToast(true); // muestra el pop-up

            // Ocultar el toast automáticamente después de 3 segundos
=======
            setActiveModal('login');
            setShowToast(true);
>>>>>>> a08fe236ade62a22768ba9abbdab165dd3a2a256
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
<<<<<<< HEAD
      {showLoginSuccessModal && (
              <ModalLoginExitoso onClose={() => setShowLoginSuccessModal(false)} />
            )}

=======
>>>>>>> a08fe236ade62a22768ba9abbdab165dd3a2a256
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
<<<<<<< HEAD

 {activeModal === "register" && (
        <RegisterModal
          onClose={() => setActiveModal(null)}
          onLoginClick={() => setActiveModal("login")}
        />
      )}

      {showCompleteProfileModal && (
        <CompleteProfileModal
          onComplete={(data) => {
            console.log("✅ Perfil completado:", data);
          }}
          onSuccess={() => {
            console.log(
              "✅ Perfil actualizado, redirigiendo automáticamente..."
            );
            setShowCompleteProfileModal(false);

            // Redirección automática
            setTimeout(() => {
              window.location.href = "/home/homePage";
            }, 500); // pequeño delay opcional
          }}
          onClose={() => setShowCompleteProfileModal(false)}
        />
      )}
    </div>
=======
    </>
>>>>>>> a08fe236ade62a22768ba9abbdab165dd3a2a256
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HomePageContent />
    </Suspense>
  );
}