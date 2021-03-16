window.$ = require('jquery');
window.joint = require('jointjs');
window.dagre = require('dagre');
window.graphlib = require('graphlib');

export function _init() {
        var graph = new joint.dia.Graph;
        var paper = new joint.dia.Paper({
            el: $('#topology'),
            width: 1000,
            height: 600,
            gridSize: 1,
            model: graph
        });
    
        joint.shapes.html = {};
        joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
            defaults: joint.util.deepSupplement({
                type: 'html.Element',
                attrs: {
                    rect: { stroke: 'none', 'fill-opacity': 0 }
                }
            }, joint.shapes.basic.Rect.prototype.defaults)
        });
    
    
        // Create a custom view for that element that displays an HTML div above it.
        // -------------------------------------------------------------------------
    
        joint.shapes.html.ElementView = joint.dia.ElementView.extend({
            metricInfo : [
                
            ].joint(''),

            initialize: function() {
                var template = [
                    '<div class="html-element">',
                    '<div class="',this.model.attributes.prop.type, '"></div>',
                    '</div>'
                ].join('');
                _.bindAll(this, 'updateBox');
                joint.dia.ElementView.prototype.initialize.apply(this, arguments);
                this.$box = $(_.template(template)());
                this.model.on('change', this.updateBox, this);
    
                this.updateBox();
            },
            render: function() {
                joint.dia.ElementView.prototype.render.apply(this, arguments);
                this.paper.$el.prepend(this.$box);
                this.updateBox();
                return this;
            },
            updateBox: function() {
                var bbox = this.model.getBBox();
                this.$box.css({
                    width: bbox.width,
                    height: bbox.height,
                    left: bbox.x,
                    top: bbox.y,
                    transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
                });
            }
        });

        const connect = (source, target,port) => {
            var l = new joint.shapes.standard.Link();
            l.source(source);
            l.target(target);
            l.attr({
                line: {
                    targetMarker: {
                        type: 'ellipse'
                    }
                }
            })
            if(port) {
                l.attr('line/sourceMarker', {
                    type: 'circle',
                    r: 5,
                    cx: 15
                })
            }
            return l;
        }

        var el1 = new joint.shapes.html.Element({
            position: { x: 500, y: 80 },
            size: { width: 80, height: 80 },
            prop: {
                type: 'spine'
            }
        });
        var el2 = new joint.shapes.html.Element({
            position: { x: 350, y: 350 },
            size: { width: 80, height: 80 },
            prop: {
                type: 'spine'
            }
        });
        var el3 = new joint.shapes.html.Element({
            position: { x: 650, y: 350 },
            size: { width: 80, height: 80 },
            prop: {
                type: 'spine'
            }
        });
        var l1 = connect(el1, el2, true);
        var l2 = connect(el1, el3);
    
        graph.addCells([el1, el2, el3, l1, l2]);
    }
// }