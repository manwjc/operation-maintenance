<template>
    <div class="pool">
        <div class="up1Left">
            <div class="img">
                <img src="../iframeImg/homeIcon1.png" alt="">
            </div>
            <div class="name">
                <p>资源池</p>
                <p style="color:#f98803">{{IdcCount}}</p>
            </div>
        </div>
        <div class="up1Left">
            <div class="img">
                <img src="../iframeImg/homeIcon2.png" alt="">
            </div>
            <div class="name">
                <p>POD池</p>
                <p style="color:#fc1327">{{PodCount}}</p>
            </div>
        </div>
    </div>
</template>
<script>

import iframe from 'src/services/iframe/iframe.js'

export default {
    data() {
        return {
            alertNum: {},

            IdcCount: '', // --资源池数量
            PodCount: '', // --POD池数量
        }
    },
    created() {
        this.getCountIdcAndPod()
    },
    methods: {
        getCountIdcAndPod() {
            iframe.getCountIdcAndPod().then((res) => {
                this.IdcCount = res.idcCount
                this.PodCount = res.podCount
            })
        }
    }
}
</script>
<style lang="scss" scoped>

@import "./rem";

.pool {
    height:100%;
    .up1Left {
        position:relative;
        float:left;
        text-align:center;
        width:50%;
        height:100%;
        .img {
            display:inline-block;
            img {
                position: absolute;
                width:rem(90);
                height:rem(90);
                top: 0;
                left: -30%;
                bottom: 0;
                right: 0;
                margin: auto;
            }
        }
        .name {
            position: absolute;
            text-align: center;
            top: 0;
            left: 30%;
            bottom: 0;
            right: 0;
            margin: auto;
            width:90px;
            height:60px;
            p:nth-child(1) {
                color:#363636;
                font-size:rem(18);
                font-weight: 400;
            }
            p:nth-child(2) {
                font-size: rem(40);
            }
        }
    }
}
</style>