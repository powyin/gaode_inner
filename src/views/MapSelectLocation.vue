<template>
  <div>
    <div>
      <div class="map-title">
        <div class="arrLeftGo_hint_click">请点击地图选择起点/终点</div>
        <div class="arrLeftGo_back" @click="goBack">
          <img class="arrLeftGo_back_img" src="./left_arraw.png" />
        </div>
      </div>
    </div>

    <div id="container"></div>

    <div class="map_contain_leve">
      <img class="map_contain_leve_top" src="./arraw_up.png" />
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

    <div class="containner_contain_select_loc">
      <img class="containner_contain_select_loc_img" src="./location_go.png" />
      <div class="containner_contain_select_loc_info">地图选点</div>

      <div class="containner_contain_select_loc_start" @click="location_start">
        <img
          class="containner_contain_select_loc_inner_img"
          src="./location_from.png"
        />从这走
      </div>
      <div
        class="containner_contain_select_loc_target"
        @click="location_target"
      >
        <img
          class="containner_contain_select_loc_inner_img"
          src="./location_target.png"
        />
        到这去
      </div>
    </div>
  </div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";
import { ElMessage } from "element-plus";
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
      top: 0,
      markerLoc: "地图选点",

      mapLayoutDataSelect: "F1",
      mapLayoutDataList: {
        F2: {
          name: "F2",
          mapUrl: "https://yd-mobile.cn/lanzhou/api/getPng",
          roadPath: {},
        },
        F1: {
          name: "F1",
          mapUrl:
            "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]",
          roadPath: {},
        },
        B1: {
          name: "B1",
          mapUrl: "https://yd-mobile.cn/lanzhou/api/g",
          roadPath: {},
        },
      },
    };
  },
  create() {},
  methods: {
    ininMap() {
      AMapLoader.load({
        key: "b456d4037e33b69b32cf75c7f0f5b219", //设置您的key
        version: "2.0",
        plugins: ["AMap.ToolBar", "AMap.Driving"],
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            zoom: 15,
            zooms: [2, 22],
            center: [103.684725, 36.085586],
          });

          this.mapDrawLeave();

          let that = this;
          this.map.on("click", function (ev) {
            if (ev.type == "click") {
              if (that.markerSelectLocation) {
                that.map.remove(that.markerSelectLocation);
              }
              that.markerSelectLocation = new AMap.LabelMarker({
                icon: {
                  image: "https://tsimg.supconit.net/demo/LZSport/map/pop.png",
                  size: [23, 33],
                },
                position: [ev.lnglat.lng, ev.lnglat.lat],
                anchor: "bottom-center",
              });
              that.map.add(that.markerSelectLocation);
            }
          });
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
        // 图块取图地址
        getTileUrl: current.mapUrl,
        zIndex: 100,
      });
      this.map.add(this.xyzTileLayer);
    },

    location_start() {
      if (this.markerSelectLocation) {
        let postion = this.markerSelectLocation._opts.position;
        console.log("setPOinter");
        this.$store.commit("SET_POINT_START", {
          lng: postion[0],
          lat: postion[1],
          name: this.markerLoc,
        });
        this.$router.back();
      } else {
        ElMessage("请点击地图 选择起始点哦");
      }
    },
    location_target() {
      if (this.markerSelectLocation) {
        let postion = this.markerSelectLocation._opts.position;
        this.$store.commit("SET_POINT_TARGET", {
          lng: postion[0],
          lat: postion[1],
          name: this.markerLoc,
        });
        this.$router.back();
      } else {
        ElMessage("请点击地图 选择终点哦");
      }
    },
    goBack() {
      this.$router.back();
    },
  },
  watch: {},
  mounted() {
    //DOM初始化完成进行地图初始化
    this.ininMap();
  },
};
</script>
<style scoped>
#container {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
  position: fixed;
  left: 0px;
  right: 0px;
}
.map-title {
  position: fixed;
  z-index: 10;
  width: 100%;
  min-height: 3.65rem;
  background-color: #ffffff88;
}

.arrLeftGo_back {
  position: absolute;
  top: 0.49rem;
  left: 0.38rem;
  width: 2.65rem;
  height: 2.65rem;
  box-sizing: border-box;
  padding: 0.36rem;
}
.arrLeftGo_back_img {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 0.3rem;
  box-sizing: border-box;
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
  padding-left: 0.45rem;
  padding-right: 0.45rem;
}

.arrLeftGo_hint_click {
  position: absolute;
  text-align: center;
  color: rgba(45, 51, 57, 1);
  top: 0.9rem;
  left: 15vw;
  width: 80vw;
  height: 1.8rem;
  padding-top: 0.5rem;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 0.2rem;
  font-size: 0.9rem;
  line-height: 1;
}

.arrLeftGo_switch {
  position: absolute;
  top: 1.2rem;
  left: 80vw;
  width: 3rem;
  height: 3rem;
  box-sizing: border-box;
  z-index: 50;
  padding: 0.5rem;
}

.arrLeftGo_switch_road {
  position: absolute;
  top: 1.2rem;
  left: 18vw;
  width: 0.65rem;
  height: 3rem;
  box-sizing: border-box;
  z-index: 50;
}

.road_start {
  font-size: 0.8rem;
  color: rgb(59, 59, 59);
  box-sizing: border-box;
  height: 1.6rem;
  position: absolute;
  left: 23vw;
  top: 0.65rem;
  width: 55vw;
  z-index: 51;
  border: 0;
  background-color: #00000000;
  outline: none;
  vertical-align: middle;
}

.road_target {
  font-size: 0.8rem;
  color: rgb(59, 59, 59);
  box-sizing: border-box;
  height: 1.6rem;
  position: absolute;
  left: 23vw;
  top: 3.08rem;
  width: 55vw;
  z-index: 51;
  border: 0;
  background-color: #00000000;
  outline: none;
}

.locationSelection {
  position: relative;
  top: 5.65rem;
  width: 100vw;
  min-height: calc(100vh - 5.65rem);
  background-color: #ffffff;
  z-index: 5;
}

.locationSelection_divice {
  background-color: #f8f8f8;
  width: 100vw;
  height: 4.1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.locationSelection_location_cont {
  background-color: #ffffff;
  width: 40vw;
  height: 2.6rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.locationSelection_location_img {
  width: 1.3rem;
  height: 1.3rem;
}
.locationSelection_location_info {
  font-size: 0.9rem;
  color: #69737c;
  margin-left: 0.5rem;
}

.search_item {
  width: 100vw;
  height: 3.9rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search_item_location {
  width: 1.2rem;
  height: 1.2rem;

  box-sizing: border-box;
  margin-left: 1rem;
  margin-right: 1rem;
}

.search_item_content {
  flex-grow: 1;
  min-height: 1rem;

  box-sizing: border-box;
}
.search_item_content_title {
  box-sizing: border-box;
  font-size: 0.9rem;
  font-family: PingFang-SC-Bold, PingFang-SC;
  color: #8d99a5;
  line-height: 1;
}
.search_item_content_content {
  margin-top: 00.5rem;
  box-sizing: border-box;
  font-size: 0.8rem;
  font-family: PingFang-SC-Bold, PingFang-SC;
  color: #8d99a5;
  line-height: 1;
}
.search_item_guide {
  border-radius: 0.55rem 0.55rem 3px 3px;
  border: 1px solid #3065db;
  box-sizing: border-box;
  margin-left: 1rem;
  margin-right: 1rem;
  background-color: rgba(48, 101, 219, 0.1);
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  padding-left: 0.39rem;
  padding-right: 0.39rem;
  font-size: 0.5rem;
  font-family: PingFang-SC-Medium, PingFang-SC;
  color: #3065db;
  line-height: 1;
}

.map_contain_leve {
  position: fixed;
  width: 2.01rem;
  left: 1.2rem;
  bottom: 8.5rem;
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
.containner_contain_select_loc {
  position: fixed;
  width: 100vw;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 6rem;
  background-color: #ffffff;
  z-index: 2;
}

.containner_contain_select_loc_img {
  position: absolute;
  width: 1.3rem;
  height: 1.3rem;
  left: 1.3rem;
  top: 0.8rem;
}
.containner_contain_select_loc_info {
  position: absolute;
  font-size: 0.96rem;
  line-height: 1;
  left: 3.6rem;
  top: 1.01rem;
  color: rgba(45, 51, 57, 1);
}

.containner_contain_select_loc_start {
  position: absolute;
  font-size: 0.9rem;
  line-height: 1;
  left: 6.8vw;
  top: 3.11rem;
  width: 38vw;
  height: 1.9rem;
  color: rgba(48, 101, 219, 1);
  border-radius: 1.8rem;
  border: 1px solid #3065db;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.containner_contain_select_loc_target {
  position: absolute;
  font-size: 0.9rem;
  line-height: 1;
  left: 53.8vw;
  top: 3.11rem;
  width: 38vw;
  height: 1.9rem;
  color: rgba(255, 255, 255, 1);
  border-radius: 1.8rem;
  box-sizing: border-box;
  background-color: rgba(48, 101, 219, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.containner_contain_select_loc_inner_img {
  width: 1.3rem;
  height: 1.3rem;
  margin-right: 0.35rem;
}
</style>