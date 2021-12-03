let abortController = new AbortController();

async function startNDEFReaderJS() {
    try {
        const ndef = new NDEFReader();
        abortController = new AbortController();
        await ndef.scan({signal: abortController.signal});
        ndef.onreadingerror = (event) => raiseErrorEvent("readErrorJS", event);
        ndef.onreading = event => {
            let jsNDEFRecords = event.message.records;
            let nativeNDEFRecords = [];
            // Create NDEF Records
            for (recordIdx in jsNDEFRecords) {
                let nativeNDEFRecord;
                try {
                    nativeNDEFRecord = Translator.getNativefromWebNDEFRecord(jsNDEFRecords[recordIdx]);
                    nativeNDEFRecords.push(nativeNDEFRecord);
                } catch (e) {
                    raiseErrorEvent("readErrorJS", e);
                    continue;
                }
            };
            // Create NDEF Message
            let nativeNDEFMessage = Translator.getNativefromWebNDEFMessage(nativeNDEFRecords);
            // Dispatch Event to Dart
            var customEvent = new CustomEvent("readSuccessJS", {detail: nativeNDEFMessage});
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
        const nativeNDEFRecords = [];
        console.log(records);
        records.forEach(function(record) {
            let nativeNDEFRecord = Translator.getNativefromWebNDEFRecord(record);
            //var ndefObject = JSON.parse(record);
            //ndefObject = Object.entries(ndefObject).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {})
            nativeNDEFRecords.push(nativeNDEFRecord);
        });
        await ndef.write({records: nativeNDEFRecords});
        //var customEvent = new CustomEvent("writeSuccessJS");
        //document.dispatchEvent(customEvent);
        return;
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

var NdefRecord = function(identifier, payload, typeNameFormat, type) {
    // encoding
    // id
    // lang
    // mediaType
    // recordType
    // data
    this.data = Translator.URI_PREFIX_LIST[payload.slice(0,1)] + new TextDecoder().decode(payload.slice(1));
};
/*
    Translates Web-NFC NDEFRecord to native NDEFRecord as Map and vice versa
    See W3C Specifications for the mapping: https://w3c.github.io/web-nfc/#data-mapping
*/
class Translator {

    static URI_PREFIX_LIST = [
        '',
        'http://www.',
        'https://www.',
        'http://',
        'https://',
        'tel:',
        'mailto:',
        'ftp://anonymous:anonymous@',
        'ftp://ftp.',
        'ftps://',
        'sftp://',
        'smb://',
        'nfs://',
        'ftp://',
        'dav://',
        'news:',
        'telnet://',
        'imap:',
        'rtsp://',
        'urn:',
        'pop:',
        'sip:',
        'sips:',
        'tftp:',
        'btspp://',
        'btl2cap://',
        'btgoep://',
        'tcpobex://',
        'irdaobex://',
        'file://',
        'urn:epc:id:',
        'urn:epc:tag:',
        'urn:epc:pat:',
        'urn:epc:raw:',
        'urn:epc:',
        'urn:nfc:',
    ];

    static WEB_TO_NATIVE_TNF = {
        "empty": 0x00,
        "text": 0x01,
        "url": 0x01,
        "smart-poster": 0x01,
        "mime": 0x02,
        "absolute-uri": 0x03,
        "unknown": 0x05
    }

    static WEB_TO_NATIVE_TYPE = {
        "empty": null,
        "text": "T",
        "url": "U",
        "smart-poster": "Sp",
        "unknown": null
    }

    static NATIVE_TO_WEB_TNF = {
        0x00 : "empty",
        0x01 : {
            "T": "text",
            "U": "url",
            "Sp": "smart-poster"
        },
        0x02: "mime",
        0x03: "absolute-url",
        0x05: "unknown"
    }

    static getWebfromNativeNDEFRecord(record){
        let id, recordType, mediaType, data, encoding, lang;
        // Identifier
        id = identifier;
        // RecordType
        if (record.typeNameFormat == 0x01) {
            recordType = this.NATIVE_TO_WEB_TNF[record.typeNameFormat][record.type];
        } else {
            recordType = this.NATIVE_TO_WEB_TNF[record.typeNameFormat];
        }
        // Data
    }

    static getNativefromWebNDEFRecord(record) {
        let encoder = new TextEncoder();
        let typeNameFormat, identifier, payload, type;
        // Identifier
        identifier = record.id;
        // Payload
        payload = new Uint8Array(record.data.byteLength);
        for (var i = 0; i < payload.length; i++) {
            payload[i] = record.data.getUint8(i);
        }
        // Type Name Format
        typeNameFormat = this.WEB_TO_NATIVE_TNF[record.recordType];
        if (typeNameFormat == null) throw TypeError;
        // Type
        switch (record.record) {
            case "mime":
                type = record.mediaType;
                break;
            case "absolute-uri":
                type = payload; // TODO: verify if correct
                break;
            default:
                type = this.WEB_TO_NATIVE_TYPE[record.recordType];
                if (type == null) throw TypeError;
        }
        type = encoder.encode(type);
        // Encoding TODO
        if (record.encoding != null && record.encoding != "utf-8") return;
        // Return as Map
        return {
            typeNameFormat: typeNameFormat,
            type: type, 
            identifier: identifier, 
            payload: payload 
        };
    }

    static getNativefromWebNDEFMessage(records) {
        return { 
            handle: event.serialNumber,
            ndef: {
                //identifier
                //isWritable,
                //maxSize,
                //canMakeReadOnly
                cachedMessage: {
                    records: records
                }
            }
        };
    }
}