<template>
    <b-container class="flens-container" fluid>
        <b-row>
            <b-col cols="6" class="topology">
                <topology :mainSearch="search"/>
            </b-col>
            <b-col class="searchDetail">
                <search-detail ref="searchDetail"/>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import Topology from "./Topology"
import SearchDetail from "./SearchDetail"
export default {
    name: "Main",
    components: {
        Topology,
        SearchDetail
    },
    methods: {
        search() {
            this.$refs.searchDetail.mainSearch();
        }
    }
}
</script>

<style lang="scss">
.flens-container {
    min-height: 60rem;
    .topology {
        min-height: 800px;
        min-width: 600px;
    }
}

</style>
