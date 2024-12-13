const calculatePriceByRom = (basePrice: number, rom: string) => {
    let coefficient = 1.0;
    switch (rom) {
        case "128GB":
            coefficient = 1.2;
            break;
        case "256GB":
            coefficient = 1.3;
            break;
        case "512GB":
            coefficient = 1.4;
            break;
        case "1TB":
            coefficient = 2;
            break;
        case "2TB":
            coefficient = 2.1;
            break;
        case "64GB":
        case null:
        default:
            coefficient = 1.0;
    }
    return basePrice * coefficient;
}

export default calculatePriceByRom