export function define_link() {
    joint.shapes.standard.Link.define('examples.CustomLink', {
        attrs: {
            line: {
                connection: { stubs: 0 },
                fill: 'none',
                stroke: 'black',
                strokeWidth: 2,
                targetMarker: {
                    type: 'ellipse',
                }
            },
            endReferenceBody: {
                r: 5,
                fill: 'black',
                cursor: 'pointer'
            },
            sourceReference: {
                atConnectionLength: 30
            },
            targetReference: {
                atConnectionLength: -30
            }
        }
    }, {
        markup: [{
            tagName: 'path',
            selector: 'line'
        }, {
            tagName: 'g',
            selector: 'sourceReference',
            children: [{
                tagName: 'circle',
                selector: 'source',
                groupSelector: 'endReferenceBody'
            }]
        }, {
            tagName: 'g',
            selector: 'targetReference',
            children: [{
                tagName: 'circle',
                selector: 'target',
                groupSelector: 'endReferenceBody'
            }]
        }]
    });
}