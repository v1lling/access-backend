let abortController = new AbortController();

async function startNDEFReaderJS() {
    try {
        const ndef = new NDEFReader();
        await ndef.scan({signal: abortController.signal});
        ndef.onreadingerror = (event) => raiseErrorEvent("readErrorJS", event);
        ndef.onreading = event => {
            let records = [];
            const decoder = new TextDecoder();
            console.log(event.message.records);
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
            var customEvent = new CustomEvent("readSuccessJS", {detail: records});
            document.dispatchEvent(customEvent);
            return;
        };
    } catch(error) {
        raiseErrorEvent("readErrorJS", error.message);
    }
}

function stopNDEFReaderJS() {
    return abortController.abort();
}

async function startNDEFWriterJS(records) {
    try {
        const ndef = new NDEFReader();
        // TODO: first stop the reader, then write ??
        const ndefRecords = [];
        records.forEach(function(record) {
            var ndefObject = JSON.parse(record);
            ndefObject = Object.entries(ndefObject).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {})
            ndefRecords.push(ndefObject);
        });
        await ndef.write({records: ndefRecords});
        var customEvent = new CustomEvent("writeSuccessJS");
        document.dispatchEvent(customEvent);
    } catch(error) {
        console.log(error);
        raiseErrorEvent("writeErrorJS", error);
    };
}

function raiseErrorEvent(errEvent, errMessage) {
    var customEvent = new CustomEvent(errEvent);
    document.dispatchEvent(customEvent, {detail: errMessage});
    return;
}

function removeNullProperties(obj) {
    Object.keys(obj).forEach(key => {
      let value = obj[key];
      let hasProperties = value && Object.keys(value).length > 0;
      if (value === null) {
        delete obj[key];
      }
      else if ((typeof value !== "string") && hasProperties) {
        removeNullProperties(value);
      }
    });
    return obj;
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