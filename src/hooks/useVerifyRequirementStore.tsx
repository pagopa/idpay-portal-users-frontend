import { useRef } from 'react';

let iseeCache = '';
let selfDeclCache = false;

export const useVerifyRequirementStore = () => {
    const iseeRef = useRef(iseeCache);
    const selfDeclRef = useRef(selfDeclCache);

    const setIsee = (val: string) => {
        iseeRef.current = val;
        iseeCache = val;
    };

    const setSelfDeclaration = (val: boolean) => {
        selfDeclRef.current = val;
        selfDeclCache = val;
    };

    return {
        isee: iseeRef.current,
        selfDeclaration: selfDeclRef.current,
        setIsee,
        setSelfDeclaration
    };
};