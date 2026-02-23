"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import http from "@/services/http/index.service";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    http.setJWT();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
