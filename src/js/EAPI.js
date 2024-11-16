export async function sendEapiRequest(auth, command) {
    const {ipAddress, username, password} = auth;
    const url = `https://${ipAddress}/command-api`;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(`${username}:${password}`));

    if (!Array.isArray(command)) {
        command = [command]
    }

    const body = JSON.stringify({
        jsonrpc: '2.0',
        method: 'runCmds',
        params: {
            version: 1,
            cmds: command,
            format: 'json'
        },
        id: 1
    });
    if(!(document.getElementById("loading") === null)) {document.getElementById("loading").style.display = "block"}
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
    });
    if(!(document.getElementById("loading") === null)) document.getElementById("loading").style.display = "none";

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
        throw new Error(`Erreur eAPI : ${data.error.message}`);
    }

    if (data.result.length > 1) {
        return data.result
    } else {
        return data.result[0];
    }
}

export function getShortPortName(port) {
    if (port.startsWith('Port-Channel')) {
        return 'Po' + port.replace('Port-Channel', '');
    } else if (port.startsWith('Management')) {
        return 'M' + port.replace('Management', '');
    }
    return port.replace('Ethernet', 'Et');
}