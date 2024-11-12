import { EffectCallback, useCallback, useEffect, useRef } from "react";

const useDebounce = (cb: Function, delay: number): EffectCallback  => {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });
  
  return useCallback(
    debounceImpl((...args: any[]) => cbRef.current(...args), delay),
    [delay]
  );
}


const debounceImpl = (cb: Function, delay: number): EffectCallback => {
  let debounceTimeout: any = null;
  return (...args: any[]) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => cb(...args), delay);
  };
};

export default useDebounce;
