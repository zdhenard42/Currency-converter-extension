let currentPrice;
let currencyChosen;
let localCurrency;

function changeData() {
    chrome.storage.sync.get(["userChoiceSaved", "userLocalSaved"], function(obj) {
        currencyChosen = obj.userChoiceSaved;
        localCurrency = obj.userLocalSaved;
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${localCurrency}/${currencyChosen}.json`)
        .then(response => {
            if (response.status !== 200) {
                console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                return;
            }
            return response.json();
        })
        .then(data => {
            currentPrice = data[currencyChosen];
            walk(document.body);
        })
        .catch(err => console.log('Fetch Error :-S', err));
    });
}

function walk(node) {
    let child, next;
    let tagName = node.tagName ? node.tagName.toLowerCase() : "";
    if (tagName === "input" || tagName === "textarea" || (node.classList && node.classList.contains("ace_editor"))) {
        return;
    }
    switch (node.nodeType) {
        case 1:
        case 9:
        case 11:
            child = node.firstChild;
            while (child) {
                next = child.nextSibling;
                walk(child);
                child = next;
            }
            break;
        case 3:
            handleText(node);
            break;
    }
}

function handleText(textNode) {
    let v = textNode.nodeValue;
    if (localCurrency == 'usd') {
        let matches = v.match(/(USD|\$)\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi);
        if (matches) {
            for (let i = 0; i < matches.length; i++) {
                let num = matches[i].replace(/\$/g, "").replace(/,/g, "").replace(/USD/gi, "");
                let newValue = `\$${num} (${(num * currentPrice).toFixed(6)})${currencyChosen.toUpperCase()}`;
                v = v.replace(matches[i], newValue);
            }
        }
    }
    else if (localCurrency == 'eur') {
        let matches = v.match(/(EUR|€|Euro)\s*(\d+(?:,\d+)*(?:.\d+)?)/gi);
        if (matches) {
            console.log('eur');
            for (let i = 0; i < matches.length; i++) {
                let num = matches[i].match(/\d+(?:,\d+)*(?:\.\d+)?/gi)[0];
                let newValue = `€${num} (${(parseFloat(num) * currentPrice).toFixed(6)}) ${currencyChosen.toUpperCase()}`;
                v = v.replace(matches[i], newValue);
            }
        }
    }
    else if (localCurrency == 'gbp') {
        console.log('gbp');
        let matches = v.match(/(GBP|£)\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi);
        if (matches) {
            for (let i = 0; i < matches.length; i++) {
                let num = matches[i].match(/\d+(?:,\d+)*(?:\.\d+)?/gi)[0];
                let newValue = `£${num} (${(parseFloat(num) * currentPrice).toFixed(6)}) ${currencyChosen.toUpperCase()}`;
                v = v.replace(matches[i], newValue);
            }
        }
    }
    else if (localCurrency == 'btc') {
        let matches = v.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(BTC|Bitcoin|bitcoin)/gi);
        if (matches) {
            for (let i = 0; i < matches.length; i++) {
                let num = matches[i].match(/(\d+(?:,\d+)*(?:\.\d+)?)(?:\b|\$|\€|\s)(BTC|Bitcoin|bitcoin)/gi);
                let newValue = `${num} (${(parseFloat(num) * currentPrice).toFixed(6)}) ${currencyChosen.toUpperCase()}`;
                v = v.replace(matches[i], newValue);
            }
        }
    }   
    textNode.nodeValue = v;
}
changeData();