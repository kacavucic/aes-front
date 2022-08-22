import {useRef} from "react";

const useScroll = (block) => {
    const elRef = useRef(null);
    const executeScroll = () => elRef.current.scrollIntoView({behavior: "smooth", block: block});

    return [executeScroll, elRef];
};

export default useScroll;