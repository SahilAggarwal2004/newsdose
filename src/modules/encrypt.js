const cipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
    const byteHex = n => ("0" + Number(n).toString(16)).slice(-2);
    return text => text.toString().split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
}

export default cipher(process.env.REACT_APP_SECRET)