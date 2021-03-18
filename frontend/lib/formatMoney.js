const formatMoney = (ammount = 0) => {
    const options = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }

    // check if there is no change
    if (ammount % 100 === 0) {
        options.minimumFractionDigits = 0
    }

    const formatter = Intl.NumberFormat('en-US', options)

    return formatter.format(ammount / 100)
}

export default formatMoney
