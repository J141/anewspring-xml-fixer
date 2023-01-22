import {XMLParser, XMLBuilder} from 'fast-xml-parser'

function escapeAndParseJson(jsonData) {
    try {
        return JSON.parse(jsonData);
    } catch(e) {
        const faultIndex = Number.parseInt(e.message.match(/column ([0-9]+)/)[1]);
        for(let i = faultIndex; i > 0; i--)
            if(jsonData[i] === '"') {
                return escapeAndParseJson(jsonData.slice(0, i) + '&quot;' + jsonData.slice(i+1))
            }
    }
}

function recursivelyFixJson(node) {
    const subNodes = Object.entries(node);
    subNodes.forEach(([key, subNode]) => {
        if(subNode === null) return;
        if(typeof subNode === 'object')
            recursivelyFixJson(subNode, node, key)
        if(Array.isArray(subNode))
            subNode.forEach(x => recursivelyFixJson(x));
        if(typeof subNode === 'string' && subNode.startsWith('<'))
            node[key] = subNode.replaceAll('"', '&quot;')
    })
}

function recursivelyFixXml(node) {
    const subNodes = Object.entries(node).filter(entry => !entry[0].startsWith('@_'));
    subNodes.forEach(([key, subNode]) => {
        if(subNode === null) return;
        if(typeof subNode === 'object')
            recursivelyFixXml(subNode);
        if(Array.isArray(subNode))
            subNode.forEach(x => recursivelyFixXml(x))
        if(typeof subNode === 'string' && subNode.startsWith('{')) {
            const jsonData = subNode
                .replaceAll('&lt;', '<')
                .replaceAll('&quot;', '"')
                .replaceAll('\\""', '\\"')
                .replaceAll('"\\"', '\\"');
            const jsonDoc = escapeAndParseJson(jsonData);
            recursivelyFixJson(jsonDoc);
            node[key] = JSON.stringify(jsonDoc);
            node['@_texttype'] = 'application/json';
        }
    })
}

export function fixANewSpringXml(xml) {
    const parser = new XMLParser({ignoreAttributes: false, cdataPropName: 'cdata'});
    const xmlDoc = parser.parse(xml);
    recursivelyFixXml(xmlDoc)

    const builder = new XMLBuilder({ignoreAttributes: false, format: true, cdataPropName: 'cdata'});
    const builtXml = builder.build(xmlDoc);

    return builtXml.replace('<?xml version="1.0" encoding="UTF-8"?>', '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE questestinterop SYSTEM "ims_qtiasiv1p2.dtd">\n')
}
