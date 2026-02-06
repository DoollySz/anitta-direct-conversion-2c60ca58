import { useEffect } from "react";

export const useBackRedirect = (targetPath: string = "/oferta-especial") => {
  useEffect(() => {
    const currentParams = window.location.search;
    const backRedirectUrl = `${targetPath}${currentParams}`;
    
    // Push multiple history states
    history.pushState({}, '', location.href);
    history.pushState({}, '', location.href);
    history.pushState({}, '', location.href);
    
    const handlePopState = () => {
      setTimeout(() => {
        window.location.href = backRedirectUrl;
      }, 1);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [targetPath]);
};
