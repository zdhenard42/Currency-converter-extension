import currencies from '/assets/currencies.json' assert { type: 'json' };

const data = Object.entries(currencies);

function saveOptions() {
    const userChoice = document.getElementById('userChoiceSaved').value;
    let userLocal;
    let radios = document.getElementsByName('local');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            userLocal = radios[i].value;
        }
    }
    chrome.storage.sync.set({
        userChoiceSaved: userChoice,
        userLocalSaved: userLocal
    }, function() {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        userChoiceSaved: 'btc',
        userLocalSaved: 'usd'
    }, function(items) {
        document.getElementById('userChoiceSaved').value = items.userChoiceSaved;
        let radios = document.getElementsByName('local');
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].value === items.userLocalSaved) {
                radios[i].checked = true;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);

const selectElement = document.getElementById('userChoiceSaved');
for (let i = 0; i < data.length; i++) {
    selectElement.add(new Option(data[i][1], data[i][0]));
}
