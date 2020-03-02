export function Celsius2Farenheit(value) {
    return value * 1.8 + 32;
}

export function Farenheit2Celsius(value) {
    return (value - 32) / 1.8;
}

export function runCssAnimationByClass(target, cssClass) {
    return new Promise((resolve, reject) => {
        let handler = null;
        handler = () => {
            target.removeEventListener('animationend', handler);
            resolve();
            //target.classList.remove(cssClass);
        };
        target.addEventListener('animationend', handler);
        target.classList.add(cssClass);
    });
}