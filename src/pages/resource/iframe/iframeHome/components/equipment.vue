<template>
    <div class="equipment">
        <div class="up1Left">
            <div class="img">
                <img src="../iframeImg/homeIcon3.png" alt="">
            </div>
            <div class="name">
                <p>服务器设备</p>
                <p style="color:#05c2e7">{{ServerNumber}}</p>
            </div>
        </div>
        <div class="up1Left">
            <div class="img">
                <img src="../iframeImg/homeIcon4.png" alt="">
            </div>
            <div class="name">
                <p>网络设备</p>
                <p style="color:#0099f0">{{NetworkNumber}}</p>
            </div>
        </div>
        <div class="up1Left">
            <div class="img">
                <img src="../iframeImg/homeIcon5.png" alt="">
            </div>
            <div class="name">
                <p>存储设备</p>
                <p style="color:#1683fb">{{StorageNumber}}</p>
            </div>
        </div>
        <div class="up1Left">
            <div class="img">
                <img src="../iframeImg/homeIcon6.png" alt="">
            </div>
            <div class="name">
                <p>安全设备</p>
                <p style="color:#6a1ede">{{SafeNumber}}</p>
            </div>
        </div>
    </div>
</template>
<script>

import iframe from 'src/services/iframe/iframe.js'
export default {
    data() {
        return {
            ServerNumber: '', // --服务器数量
            NetworkNumber: '', // --网络设备数量
            SafeNumber: '', // --安全设备数量
            StorageNumber: '', // --存储设备数量
        }
    },
    created() {
        this.getCountDeviceByDeviceClass()
    },
    methods: {
        getCountDeviceByDeviceClass() {
            iframe.getCountDeviceByDeviceClass().then((res) => {
                this.ServerNumber = res.serverNumber
                this.NetworkNumber = res.networkNumber
                this.SafeNumber = res.safeNumber
                this.StorageNumber = res.storageNumber
            })
        }
    }
}
</script>
<style lang="scss" scoped>

@import "./rem";
.equipment {
    height:100%;
    .up1Left {
        position:relative;
        float:left;
        text-align:center;
        width:25%;
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
            left: 50%;
            bottom: 0;
            right: 0;
            margin: auto;
            width:90px;
            height:60px;
            p:nth-child(1) {
                font-size:rem(18);
                font-weight:400;
                color:#363636;
            }
            p:nth-child(2) {
                font-size:rem(40);
            }
        }
    }
}
</style>