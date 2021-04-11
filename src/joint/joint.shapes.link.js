export function define_link(style) {
    joint.shapes.standard.Link.define('examples.CustomLink', {
        attrs: {
            line: {
                connection: { stubs: 0 },
                fill: 'none',
                stroke: style.linkColor,
                strokeWidth: style.linkWidth,
                targetMarker: {
                    type: 'ellipse',
                }
            },
            endReferenceBody: {
                r: style.portSize,
                fill: style.portColor,
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