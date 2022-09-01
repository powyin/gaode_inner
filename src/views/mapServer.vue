<template>
  <div>
    <div id="container"></div>

    <div class="map_contain_leve">
      <img class="map_contain_leve_top" src="./arraw_up.png" />

      <p
        :class="{
          'scrollbar-demo-item': mapLayoutDataSelect == 'F4',
          'scrollbar-demo-item_unselct': mapLayoutDataSelect != 'F4',
        }"
        @click="mapLevelSelect('F4')"
      >
        F4
      </p>
      <p
        :class="{
          'scrollbar-demo-item': mapLayoutDataSelect == 'F3',
          'scrollbar-demo-item_unselct': mapLayoutDataSelect != 'F3',
        }"
        @click="mapLevelSelect('F3')"
      >
        F3
      </p>
      <p
        :class="{
          'scrollbar-demo-item': mapLayoutDataSelect == 'F2',
          'scrollbar-demo-item_unselct': mapLayoutDataSelect != 'F2',
        }"
        @click="mapLevelSelect('F2')"
      >
        F2
      </p>
      <p
        :class="{
          'scrollbar-demo-item': mapLayoutDataSelect == 'F1',
          'scrollbar-demo-item_unselct': mapLayoutDataSelect != 'F1',
        }"
        @click="mapLevelSelect('F1')"
      >
        F1
      </p>

      <p
        :class="{
          'scrollbar-demo-item': mapLayoutDataSelect == 'B1',
          'scrollbar-demo-item_unselct': mapLayoutDataSelect != 'B1',
        }"
        @click="mapLevelSelect('B1')"
      >
        B1
      </p>
      <img class="map_contain_leve_buttom" src="./arraw_down.png" />
    </div>

    <div class="service-content">
      <div class="service-content-title">
        <img src="../static/imgs/service/title_icon.png" />便民服务
      </div>
      <div class="serviceList">
        <div
          class="serviceList-part"
          v-for="(item, index) in serviceList"
          :key="index"
        >
          <img :src="item.img" />
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";
import util from "./util";
const axios = require("axios").default;
const qs = require("qs");

export default {
  name: "mapcomtaint",
  setup() {
    const map = shallowRef(null);
    return {
      map,
    };
  },
  data() {
    return {
      zoom: 5,
      mapLayoutDataSelect: "F2",
      mapLayoutDataList: {
        F4: {
          name: "F4",
          mapUrl:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]&f=f4",

          mapUrlOut:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]&f=sw",
          roadPath: {},
        },
        F3: {
          name: "F3",
          mapUrl:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]&f=f3",
          mapUrlOut:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]&f=sw",
          roadPath: {},
        },
        F2: {
          name: "F2",
          mapUrl:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]&f=f2",
          mapUrlOut:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]&f=sw",
          roadPath: {},
        },
        F1: {
          name: "F1",
          mapUrl:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]&f=f1",
          mapUrlOut:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]&f=sw",
          roadPath: {},
        },
        B1: {
          name: "B1",
          mapUrl: "https://yd-mobile.cn/lanzhou/api/g",
          mapUrlOut:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]&f=sw",
          roadPath: {},
        },
      },

      serviceList: [
        {
          name: "AED",
          img: require("../static/imgs/service/service_icon1.png"),
          mapIcon: require("../static/imgs/service/map_icon1.png"),
        },
        {
          name: "问讯处",
          img: require("../static/imgs/service/service_icon2.png"),
          mapIcon: require("../static/imgs/service/map_icon2.png"),
        },
        {
          name: "卫生间",
          img: require("../static/imgs/service/service_icon3.png"),
          mapIcon: require("../static/imgs/service/map_icon3.png"),
        },
        {
          name: "充电桩",
          img: require("../static/imgs/service/service_icon4.png"),
          mapIcon: require("../static/imgs/service/map_icon4.png"),
        },
        {
          name: "售卖机",
          img: require("../static/imgs/service/service_icon5.png"),
          mapIcon: require("../static/imgs/service/map_icon1.png"),
        },
        {
          name: "母婴室",
          img: require("../static/imgs/service/service_icon6.png"),
          mapIcon: require("../static/imgs/service/map_icon6.png"),
        },
        {
          name: "无障碍通道",
          img: require("../static/imgs/service/service_icon7.png"),
          mapIcon: require("../static/imgs/service/map_icon7.png"),
        },
      ],
    };
  },
  computed: {
    location_current() {
      return this.$store.state.point_location_current;
    },
  },
  create() {},
  methods: {
    ininMap() {
      let that = this;
      AMapLoader.load({
        key: "b456d4037e33b69b32cf75c7f0f5b219", //设置您的key
        version: "2.0",
        plugins: ["AMap.ToolBar", "AMap.Driving"],
      })
        .then((AMap) => {
          that.AMap = AMap;
          that.map = new AMap.Map("container", {
            zoom: 15,
            zooms: [2, 22],
            center: [103.684725, 36.081586],
          });

          that.map.on("zoomchange", function (ev) {
            if (ev.type == "zoomchange") {
              that.zoom = that.map.getZoom();
            }
          });

          that.mapDrawLeave();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    mapLevelSelect(ar) {
      this.mapLayoutDataSelect = ar;
      this.mapDrawLeave();
    },

    mapDrawLeave() {
      let current = this.mapLayoutDataList[this.mapLayoutDataSelect];
      if (!current) {
        current = this.mapLayoutDataList["F1"];
      }
      if (!this.map) {
        return;
      }

      if (this.xyzTileLayer) {
        this.map.remove(this.xyzTileLayer);
      }

      this.xyzTileLayer = new AMap.TileLayer({
        getTileUrl: current.mapUrl,
        tileSize: 256,
        zooms: [6, 40],
        dataZooms: [6, 40],
        zIndex: 101,
        visible: true, //是否可见
        opacity: 1, //透明度
      });
      this.map.add(this.xyzTileLayer);

      if (!this.xyzTileLayerOut) {
        this.xyzTileLayerOut = new AMap.TileLayer({
          getTileUrl: current.mapUrlOut,
          tileSize: 256,
          zooms: [6, 40],
          dataZooms: [6, 40],
          zIndex: 100,
          visible: true, //是否可见
          opacity: 1, //透明度
        });
        this.map.add(this.xyzTileLayerOut);
      }
    },
  },

  mounted() {
    if (!this.inInit) {
      this.ininMap();
      this.inInit = true;
    }

    // 定位我的位置
    let current = this.location_current;
    if (!current || !current.lat || !current.lng) {
      if (this.$route.query.slat && this.$route.query.slng) {
        let loc = {
          lng: this.$route.query.slng,
          lat: this.$route.query.slat,
          name: "我的位置",
        };
        this.$store.commit("SET_POINT_LOCATION_CURRENT", loc);
      }
    }

    // 定位起点
    let start = this.edit_road_start;
    if (!start || !start.name || !start.lat) {
      if (
        this.$route.query.sn &&
        this.$route.query.slat &&
        this.$route.query.slng
      ) {
        start = {
          lng: this.$route.query.slng,
          lat: this.$route.query.slat,
          name: this.$route.query.sn,
        };
        this.$store.commit("SET_POINT_START", start);
      }
    }
  },
};
</script>

<style   lang='scss' >
#container {
  height: calc(100vh + 50px);
  width: 100%;
  padding: 0px;
  margin: 0px;
  position: fixed;
  left: 0px;
  right: 0px;
}

.map_contain_leve {
  position: fixed;
  width: 2.01rem;
  left: 1.2rem;
  bottom: 15.5rem;
  background-color: #ffffff;
  border-radius: 2rem;
  box-shadow: 0px 0px 6px #888888;
  padding: 0px;
  margin: 0px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.map_contain_leve_top {
  width: 1.5rem;
  height: 1.5rem;
  box-sizing: border-box;
  padding-left: 0.35rem;
  padding-right: 0.35rem;
  padding-top: 0.45rem;
  padding-bottom: 0.25rem;
  border-radius: 1.8rem;
}

.map_contain_leve_buttom {
  width: 1.5rem;
  height: 1.5rem;
  box-sizing: border-box;
  padding-left: 0.35rem;
  padding-right: 0.35rem;
  padding-bottom: 0.45rem;
  padding-top: 0.25rem;
  border-radius: 1.8rem;
}

.scrollbar-demo-item {
  height: 1.88rem;
  width: 100%;
  text-align: center;
  color: #ffffff;
  background-color: #3065db;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 0.73rem;
  box-sizing: border-box;
  padding-left: 0.1rem;
  padding-top: 0.39rem;
}

.scrollbar-demo-item_unselct {
  height: 1.88rem;
  width: 100%;
  text-align: center;
  color: rgba(141, 153, 165, 1);
  background: #ffffff;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 0.73rem;
  box-sizing: border-box;
  padding-left: 0.1rem;
  padding-top: 0.39rem;
}

.zoom_show {
  position: fixed;
  top: 13rem;
  right: 2rem;
  background: #ffffffff;
  padding-left: 1rem;
  padding-right: 1rem;
  color: #3065db;
  font-size: 1.2rem;
  z-index: 20;
}

.service-content {
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
  border-radius: 12px 12px 0px 0px;
  padding: 12px 0px;
  width: 100%;
  box-sizing: border-box;
  .service-content-title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2d3339;
    font-size: 0.9rem;
    img {
      margin-right: 5px;
      width: 15px;
      height: 15px;
    }
  }
  .serviceList {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 15px;
    > div {
      width: 25%;
      text-align: center;
      font-size: 14px;
      color: #2d3339;
      margin-top: 16px;
      img {
        width: 40px;
        height: 40px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>


 
 