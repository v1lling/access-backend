let abortController = new AbortController();

async function startNDEFReaderJS() {
    const ndef = new NDEFReader();
    const nfcPermissionStatus = await navigator.permissions.query({ name: "nfc" });
    ndef.scan({signal: abortController.signal}).then(() => {
        console.log("Scan started successfully.");
        ndef.onreadingerror = (event) => raiseErrorEvent(event);
        ndef.onreading = event => {
            console.log(event);
            let records = [];
            const decoder = new TextDecoder();
            event.message.records.forEach(function(record) {
                let recordObj = new JsNdefRecord({
                    data: decoder.decode(record.data),
                    encoding: record.encoding,
                    id: record.id,
                    lang: record.lang,
                    mediaType: record.mediaType,
                    recordType: record.recordType
                });
                records.push(JSON.stringify(recordObj));
            });
            // dispatch event to dart
            var customEvent = new CustomEvent("tagDiscoveredJS", {detail: records});
            document.dispatchEvent(customEvent);
            return;
        };
        
    }).catch(error => {
        console.log(error);
        raiseErrorEvent(error.message);
    });
}

function stopNDEFReaderJS() {
    return abortController.abort();
}

function raiseErrorEvent(errMessage) {
    var customEvent = new CustomEvent("errorJS");
    document.dispatchEvent(customEvent, {detail: errMessage});
    return;
}

class JsNdefRecord {
    constructor({data, encoding, id, lang, mediaType, recordType}) {
        this.data = data;
        this.encoding = encoding;
        this.id = id;
        this.lang = lang;
        this.mediaType = mediaType;
        this.recordType = recordType;
    }
    
    toJSON() {
        return {
            "data": this.data,
            "encoding": this.encoding,
            "id": this.id,
            "lang": this.lang,
            "mediaType": this.mediaType,
            "recordType": this.recordType
        };
    }
}