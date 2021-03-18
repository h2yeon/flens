<template>
    <div id="topology"></div>
</template>

<script>
import {defind_html} from '@/joint/joint.shapes.device.js';
import {_init} from '@/joint/topology.js';
export default {
    name: "Topology",
    mounted() {
        defind_html();
        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper({
            el: $('#topology'),
            model: this.graph
        });
        _init(this.graph, this.paper);

    },
    data() {
        return {
            graph: null,
            paper: null
        }
    }
}
</script>

<style lang="scss">
@import '~@/assets/scss/topology';
</style>
