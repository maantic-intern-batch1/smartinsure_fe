function rupeesFormat(num) {
    const str = num.toString()
    if (str.length <= 3) {
        return '₹' + str
    }

    const [remStr, lastThree] = [str.slice(0, str.length - 3), str.slice(-3)]
    const remStrRev = remStr.split('').reverse().join('')

    let i = 0
    let j = -1
    let newStr = ''
    while (i < remStr.length) {
        if (j === 1) {
            j = 0
            newStr += ',' + remStrRev[i]
        } else {
            j += 1
            newStr += remStrRev[i]
        }
        i += 1
    }
    return '₹' + newStr.split('').reverse().join('') + ',' + lastThree
}

export default rupeesFormat
