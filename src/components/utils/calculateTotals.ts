type PriceModifierType = "percentage" | "fixed";

interface PriceModifier {
    amount: number;
    type: PriceModifierType;
}

interface OrderItem {
    price: number;
    quantity: number;
    itemDiscount?: PriceModifier;
}

interface Table {
    orders: OrderItem[];
    serviceCharge?: PriceModifier;
    totalDiscount?: PriceModifier;
    id: number;
}

interface TakeoutDetails {
    deliveryFee: number;
}

interface OrderSummary {
    subTotal: number;
    serviceChargeAmount: number;
    totalDiscountAmount: number;
    totalAfterDiscount: number;
    taxAmount: number;
    grandTotal: number;
    deliveryFee: number;
}

const TAX_RATE = 0.09;
const TAKEAWAY_TABLE_ID = 999;

export const calculateOrderSummary = (
    table: Table,
    takeoutDetails?: TakeoutDetails
): OrderSummary => {
    const subTotal = table.orders.reduce((acc, item) => {
        const itemTotal = item.price * item.quantity;
        let discountedItemTotal = itemTotal;
        if (item.itemDiscount) {
            if (item.itemDiscount.type === "percentage") {
                discountedItemTotal = itemTotal * (1 - item.itemDiscount.amount / 100);
            } else {
                discountedItemTotal = Math.max(0, itemTotal - item.itemDiscount.amount);
            }
        }
        return acc + discountedItemTotal;
    }, 0);

    const serviceChargeAmount = table.serviceCharge
        ? table.serviceCharge.type === "percentage"
            ? subTotal * (table.serviceCharge.amount / 100)
            : table.serviceCharge.amount
        : 0;

    const totalBeforeDiscount = subTotal + serviceChargeAmount;

    const totalDiscountAmount = table.totalDiscount
        ? table.totalDiscount.type === "percentage"
            ? totalBeforeDiscount * (table.totalDiscount.amount / 100)
            : table.totalDiscount.amount
        : 0;

    const totalAfterDiscount = Math.max(0, totalBeforeDiscount - totalDiscountAmount);
    const taxAmount = totalAfterDiscount * TAX_RATE;
    let grandTotal = totalAfterDiscount + taxAmount;

    let deliveryFee = 0;
    if (table.id === TAKEAWAY_TABLE_ID && takeoutDetails) {
        deliveryFee = takeoutDetails.deliveryFee;
        grandTotal += deliveryFee;
    }

    return {
        subTotal,
        serviceChargeAmount,
        totalDiscountAmount,
        totalAfterDiscount,
        taxAmount,
        grandTotal,
        deliveryFee,
    };
};