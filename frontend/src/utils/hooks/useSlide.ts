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
        let nextIndex = index + 1;
        if (nextIndex >= data.length) nextIndex = 0;
        setIndex(nextIndex);
        setCurrent(data[nextIndex]);
        setter(data[nextIndex]);
    };

    const prevClick = () => {
        let nextIndex = index - 1;
        if (nextIndex < 0) nextIndex = data.length - 1;
        setIndex(nextIndex);
        setCurrent(data[nextIndex]);
        setter(data[nextIndex]);
    };

    return [current, nextClick, prevClick];
};
