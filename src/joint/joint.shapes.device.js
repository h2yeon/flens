export function defind_html(vue) {
    var Element = joint.dia.Element;
    var ElementView = joint.dia.ElementView;

    Element.define('html.Element', {
        size: { width: 80, height: 80 },
        fields: {
            type: '',
            name: ''
        },
        metrics: {
            hopLatency: '',
            queueCongestion: '',
            pps: '',
            throughput: ''
        },
        attrs: {
            placeholder: {
                refWidth: '100%',
                refHeight: '100%',
                fill: 'transparent'
            }
        }
    }, {
        markup: [{
            tagName: 'rect',
            selector: 'placeholder'
        }],
        htmlMarkup: [{
            tagName: 'div',
            className: 'device-container',
            selector: 'htmlRoot',
            children: [{
                tagName: 'div',
                className: 'device-img',
                groupSelector: 'field',
                attributes: {
                    'data-attribute': 'type'
                }
            },{
                tagName: 'div',
                className: 'device-popup',
                style: {
                    'position': 'absolute',
                    'pointer-events': 'auto',
                    'user-select': 'none',
                    'box-sizing': 'border-box'
                },
                children: [{
                    tagName: 'div',
                    className: 'device-popup-field',
                    children: [{
                        tagName: 'div',
                        className: 'device-popup-label',
                        textContent: 'Name',
                    },{
                        tagName: 'div',
                        className: 'device-popup-value',
                        groupSelector: 'field',
                        attributes: {
                            'data-attribute': 'name'
                        }
                    }]},{
                        tagName: 'div',
                        className: 'device-popup-header',
                        textContent: 'Metric',
                    },{
                    tagName: 'div',
                    className: 'device-popup-field',
                    children: [{
                        tagName: 'div',
                        className: 'device-popup-label',
                        textContent: 'hopLatency',
                    },{
                        tagName: 'div',
                        className: 'device-popup-value',
                        groupSelector: 'metric',
                        attributes: {
                            'data-attribute': 'hopLatency'
                        }
                    }]},{
                    tagName: 'div',
                    className: 'device-popup-field',
                    children: [{
                        tagName: 'div',
                        className: 'device-popup-label',
                        textContent: 'queueCongestion',
                    },{
                        tagName: 'div',
                        className: 'device-popup-value',
                        groupSelector: 'metric',
                        attributes: {
                            'data-attribute': 'queueCongestion'
                        }
                    }]
                },{
                    tagName: 'div',
                    className: 'device-popup-field',
                    children: [{
                        tagName: 'div',
                        className: 'device-popup-label',
                        textContent: 'pps',
                    },{
                        tagName: 'div',
                        className: 'device-popup-value',
                        groupSelector: 'metric',
                        attributes: {
                            'data-attribute': 'pps'
                        }
                    }]
                },{
                    tagName: 'div',
                    className: 'device-popup-field',
                    children: [{
                        tagName: 'div',
                        className: 'device-popup-label',
                        textContent: 'throughput',
                    },{
                        tagName: 'div',
                        className: 'device-popup-value',
                        groupSelector: 'metric',
                        attributes: {
                            'data-attribute': 'throughput'
                        }
                    }]
                },{
                    tagName: 'div',
                    className: 'device-tool-icon',
                    children: [{
                        tagName: 'div',
                        selector: 'chartIcon', 
                        className: 'device-tool-icon-chart',
                        style: {
                            'cursor':'pointer'
                        }
                    },{
                        tagName: 'div',
                        selector: 'searchIcon', 
                        className: 'device-tool-icon-search',
                        style: {
                            'cursor':'pointer'
                        }
                    }]
                }]
             }]
        }]
    });

    // Custom view for JointJS HTML element that displays an HTML <div></div> above the SVG Element.
    joint.shapes.html.ElementView = ElementView.extend({
        html: null,

        presentationAttributes: ElementView.addPresentationAttributes({
            position: ['HTML_UPDATE'],
            size: ['HTML_UPDATE'],
            fields: ['HTML_FIELD_UPDATE'],
            metrics: ['HTML_METRICS_UPDATE'],
            z: ['HTML_Z_INDEX']
        }),

        // Run these upon first render
        initFlag: ElementView.prototype.initFlag.concat([
            'HTML_UPDATE',
            'HTML_FIELD_UPDATE',
            'HTML_METRICS_UPDATE',
            'HTML_Z_INDEX'
        ]),

        confirmUpdate: function() {
            var flags = ElementView.prototype.confirmUpdate.apply(this, arguments);
            if (this.hasFlag(flags, 'HTML_UPDATE')) {
                this.updateHTML();
                flags = this.removeFlag(flags, 'HTML_UPDATE');
            }
            if (this.hasFlag(flags, 'HTML_FIELD_UPDATE')) {
                this.updateFields();
                flags = this.removeFlag(flags, 'HTML_FIELD_UPDATE');
            }
            if (this.hasFlag(flags, 'HTML_METRICS_UPDATE')) {
                this.updateMetrics();
                flags = this.removeFlag(flags, 'HTML_METRICS_UPDATE');
            }
            if (this.hasFlag(flags, 'HTML_Z_INDEX')) {
                this.updateZIndex();
                flags = this.removeFlag(flags, 'HTML_Z_INDEX');
            }
            return flags;
        },

        onRender: function() {
            this.removeHTMLMarkup();
            this.renderHTMLMarkup();
            return this;
        },

        renderHTMLMarkup: function() {
            var doc = joint.util.parseDOMJSON(this.model.htmlMarkup, joint.V.namespace.xhtml);
            var html = doc.selectors.htmlRoot;
            var fields = doc.groupSelectors.field;
            var metrics = doc.groupSelectors.metric;
            var searchIcon = doc.selectors.searchIcon;
            var chartIcon = doc.selectors.chartIcon;
            this.paper.htmlContainer.appendChild(doc.fragment);
            html.addEventListener('mouseover', this.showPopup);
            html.addEventListener('mouseout', this.hidePopup);
            searchIcon.addEventListener('mousedown', this.clickSearch);  
            this.html = html;
            this.fields = fields;
            this.metrics = metrics;
            html.setAttribute('model-id', this.model.id);
        },

        removeHTMLMarkup: function() {
            var html = this.html;
            if (!html) return;
            this.paper.htmlContainer.removeChild(html);
            this.html = null;
            this.fields = null;
            this.metrics = null;
        },

        updateHTML: function() {
            var bbox = this.model.getBBox();
            var html = this.html;
            html.style.width = bbox.width + 'px';
            html.style.height = bbox.height + 'px';
            html.style.left = bbox.x + 'px';
            html.style.top = bbox.y + 'px';
        },

        updateFields: function() {
            this.fields.forEach(function(field) {
                var attribute = field.dataset.attribute;
                var value = this.model.prop(['fields', attribute]);
                switch(field.className.toUpperCase()) {
                    case 'DEVICE-IMG' :
                        field.classList.add(value);
                        return;
                    case 'DEVICE-POPUP-VALUE' : 
                        field.textContent = value;
                        return;
                }
            }.bind(this));
        },

        updateMetrics: function() {
            this.metrics.forEach(function(metric) {
                var attribute = metric.dataset.attribute;
                var value = this.model.prop(['metrics', attribute]);
                if(metric.className.toUpperCase() == 'DEVICE-POPUP-VALUE') {
                    metric.textContent = value;
                }
            }.bind(this));
        },

        updateZIndex: function() {
            this.html.style.zIndex = this.model.get('z') || 0;
        },

        onRemove: function() {
            this.removeHTMLMarkup();
        },
        showPopup: function() {
            var popup = this.lastChild;
            popup.style.display = 'block';
            popup.classList.remove('disappear');
            popup.classList.add('appear');
        },
        hidePopup: function() {
            var popup = this.lastChild;
            popup.style.display = 'none';
            popup.classList.add('disappear');
            popup.classList.remove('appear');
        },
        clickSearch: function(event) {
            event.stopPropagation();
            var modelId = $(this.closest('.device-container')).attr('model-id');
            vue.search(modelId);
        }
    });

}   