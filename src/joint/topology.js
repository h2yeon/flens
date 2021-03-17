window.$ = require('jquery');
window.joint = require('jointjs');
window.dagre = require('dagre');
window.graphlib = require('graphlib');

export function _init(graph, paper) {
        joint.shapes.html = {};
        joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
            defaults: joint.util.deepSupplement({
                type: 'html.Element'
            }, joint.shapes.basic.Rect.prototype.defaults)
        });
    
        joint.shapes.html.ElementView = joint.dia.ElementView.extend({
            initialize: function() {
                var metricHtml = createMetricHtml({hopeLatency : 'hopeLatency다'});

                var template = [
                    '<div class="html-element">',
                    metricHtml,
                    '<div class="html-element-img ',this.model.attributes.prop.type, '"></div>',
                    '</div>'
                ].join('');
                _.bindAll(this, 'updateBox');
                joint.dia.ElementView.prototype.initialize.apply(this, arguments);
                this.$box = $(_.template(template)());
                this.model.on('change', this.updateBox, this);
                this.$box.on('mouseover', this.showMetric);
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
            },
            showMetric: function(e) {
                console.log(e);
            }
        });

        paper.on('element:mouseover', function(e) {
            
        });

        paper.on('element:mouseout',  function(e) {
            console.log(e);
        });

        const createMetricHtml = (metric) => {
            return [
                '<div class="html-metric">',
                '<div class="metric">',
                '<div class="metric-hop-latency">',
                '<div class="metric-label">hopLatency</div>',
                '<div class="metric-value">', metric.hopeLatency,'</div>',
                '</div>','</div>','</div>'
            ].join('')
        }

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