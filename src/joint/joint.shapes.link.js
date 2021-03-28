export function define_link() {
    var Link = joint.dia.Link;
    var LinkView = joint.dia.LinkView;
    Link.define('standard.Link', {
        attrs: {
            line: {
                connection: { stubs: 0 },
                fill: 'none',
                stroke: 'black',
                strokeWidth: 2
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

    joint.shapes.standard.Link.LinkView = LinkView.extend({
        onRender: function() {
            console.log('a');
            return this;
        }
    })
}