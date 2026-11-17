export const formatPrice = (price: number): string => {
    return (
        new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(price))) +
        " تومان"
    );
};

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("fa-IR").format(num);
};

export const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
};