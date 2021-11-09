import { useState } from 'react';

export const useSlide = <T>(
    data: T[],
    setter: (args: T) => unknown,
): [current: T, nextClick: () => unknown, prevClick: () => unknown] => {
    const [index, setIndex] = useState(0);
    const [current, setCurrent]: [current: T, setCurrent: (args: T) => unknown] = useState<T>(
        data[index],
    );

    const nextClick = () => {
        if (index >= data.length - 1) setIndex(0);
        else setIndex(index + 1);
        setCurrent(data[index]);
        setter(data[index]);
    };

    const prevClick = () => {
        if (index <= 0) setIndex(data.length - 1);
        else setIndex(index - 1);
        setCurrent(data[index]);
        setter(data[index]);
    };

    return [current, nextClick, prevClick];
};
