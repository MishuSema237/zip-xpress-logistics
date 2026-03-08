/**
 * Formats the freight value for display.
 * If the value is a legacy number string (no currency symbol), it prepends '$'.
 * @param freight The freight value as a string.
 * @returns The formatted freight string.
 */
export const formatFreight = (freight: string | number | undefined | null): string => {
    if (freight === undefined || freight === null || freight === '') {
        return '0.00';
    }

    const freightStr = freight.toString().trim();

    // If it's already got a currency symbol or is clearly not just a number
    // (e.g., contains anything other than digits, dots, and commas)
    // We'll check if it starts with a common currency symbol or has letters
    const hasCurrencySymbol = /^[^0-9\s]/.test(freightStr);

    if (hasCurrencySymbol) {
        return freightStr;
    }

    // If it's a plain number string, prepend $
    if (/^-?\d*(\.\d+)?$/.test(freightStr.replace(/,/g, ''))) {
        return `$${freightStr}`;
    }

    return freightStr;
};
