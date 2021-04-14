<template>
    <b-container class="flens-container" fluid>
        <b-row class="mt-3">
            <b-col xl="5" lg="12" md="12" sm="12" class="topology">
                <b-card no-body>
                    <div class="topology-title"><h4>Topology View</h4></div>
                    <topology :mainSearch="search"/>
                </b-card>
            </b-col>
            <b-col class="searchDetail">
                <b-card title="SerarchDetail View">
                    <search-detail ref="searchDetail"/>
                </b-card>
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
    min-height: 59rem;
    .topology {
        min-height: 800px;
        min-width: 700px;
        .card {
            width: 100%;
            height: 100%;
            .topology-title {
                position: absolute;
                margin: 1.25rem;
                left: 0; 
                top: 0;
            }
        }
    }
    .searchDetail {
        min-width: 700px;
    }
}

</style>
