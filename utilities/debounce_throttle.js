export function throttle(func, wait = 250) {
    let isWaiting = false;
    return function executedFunction(...args) {
        if (!isWaiting) {
            func.apply(this, args);
            isWaiting = true;
            setTimeout(() => {
                isWaiting = false;
            }, wait);
        }
    };
}

export function debounce(func, wait = 250) { // Default wait time of 250ms
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout); // Clear any previous timeout
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}