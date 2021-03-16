<template>
    <div>
        <div id="topology"></div>
    </div>
</template>

<script>
import {_init} from '@/topology.js';
export default {
    name: "Topology",
    mounted() {
        _init();
    }
}
</script>

<style lang="scss">
#topology {
    position: relative;
    border: 1px solid gray;
    display: inline-block;
    background: transparent;
    overflow: hidden;
}
.html-element {
    position: absolute;
    /* Make sure events are propagated to the JointJS element so, e.g. dragging works.*/
    pointer-events: none;
    -webkit-user-select: none;
    border-radius: 4px;
    border: none;
    z-index: 2;
    .spine {
        background: url(../images/spine.svg) no-repeat top left;
        background-size: contain;
        width: 100%;
        height: 100%;
    }
}
</style>
