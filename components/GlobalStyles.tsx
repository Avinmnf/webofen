export function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fade-in-up {
        from { 
          opacity: 0;
          transform: translateY(20px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slide-up {
        from { 
          transform: translateY(30px);
          opacity: 0;
        }
        to { 
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes scale-in {
        from { 
          transform: scale(0.9);
          opacity: 0;
        }
        to { 
          transform: scale(1);
          opacity: 1;
        }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes spin-slow-reverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      @keyframes shine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translate3d(0,0,0);
        }
        40%, 43% {
          transform: translate3d(0,-8px,0);
        }
        70% {
          transform: translate3d(0,-4px,0);
        }
        90% {
          transform: translate3d(0,-2px,0);
        }
      }
      .animate-fade-in { animation: fade-in 0.6s ease-out; }
      .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
      .animate-slide-up { animation: slide-up 0.5s ease-out; }
      .animate-scale-in { animation: scale-in 0.3s ease-out; }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-shake { animation: shake 0.5s ease-in-out; }
      .animate-pulse { animation: pulse 2s infinite; }
      .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      .animate-spin-slow-reverse { animation: spin-slow-reverse 8s linear infinite; }
      .animate-shine { animation: shine 2s infinite; }
      .animate-bounce { animation: bounce 1s ease-in-out; }
    `}</style>
  );
}