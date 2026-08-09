/* eslint-disable react-hooks/refs */
'use client';

import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';

type Handler = (data: unknown) => void;

export function useSocket(event: string, handler: Handler) {
  const handlerRef = useRef<Handler>(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    const listener = (data: unknown) => {
      handlerRef.current(data);
    };
    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, [event]);
}
