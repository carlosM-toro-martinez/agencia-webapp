import { useState, useEffect } from "react";
import cajaService from "../async/services/get/cajaService";
import { useQuery } from "react-query";

function useMain() {
  const [auth, setAuth] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCaja, setOpenCaja] = useState(false);

  const [superAdmin, setSuperAdmin] = useState(() => {
    const savedSuperAdmin = localStorage.getItem("superAdmin");
    return savedSuperAdmin ? JSON.parse(savedSuperAdmin) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [products, setProducts] = useState();

  const { data, isLoading, error, refetch } = useQuery(`cajaService`, () =>
    cajaService()
  );

  useEffect(() => {
    if (token) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading && !error) {
      if (data?.caja?.fecha_cierre) {
        setOpenCaja(false);
      } else {
        setOpenCaja(true);
      }
    }
  }, [isLoading]);

  return {
    auth,
    token,
    user,
    superAdmin,
    products,
    data,
    isLoading,
    error,
    open,
    openCaja,
    setOpenCaja,
    setOpen,
    refetch,
    setProducts,
    setSuperAdmin,
    setUser,
    setToken,
    setAuth,
  };
}

export default useMain;
