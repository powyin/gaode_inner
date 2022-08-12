<template>
  <div>
    <div>
      <div class="map-title">
        <div class="arrLeftGo_hint"></div>
        <img class="arrLeftGo" src="./left_arraw.png" @click="goBack" />
        <img class="arrLeftGo_switch_road" src="./switch_road_icon.png" />
        <img
          class="arrLeftGo_switch"
          src="./switch_road.png"
          @click="switch_road"
        />
        <input
          class="road_start"
          placeholder="请输入起点"
          v-model="edit_road_start"
          @focus="onEditFouceStart"
        />
        <input
          class="road_target"
          placeholder="请输入终点"
          v-model="edit_road_target"
          @focus="onEditFouceTarget"
        />
      </div>

      <div class="locationSelection" v-show="showLocationList">
        <div class="locationSelection_divice">
          <div
            class="locationSelection_location_cont"
            @click="click_location_current"
          >
            <img
              class="locationSelection_location_img"
              src="./location_me.png"
            />
            <div class="locationSelection_location_info">我的位置</div>
          </div>
          <div
            class="locationSelection_location_cont"
            @click="click_location_picker"
          >
            <img
              class="locationSelection_location_img"
              src="./location_select.png"
            />
            <div class="locationSelection_location_info">地图选点</div>
          </div>
        </div>

        <div
          class="search_item"
          v-for="(item, index) in searchList"
          :key="index"
        >
          <img class="search_item_location" src="./location_go.png" />
          <div class="search_item_content">
            <div class="search_item_content_title">地库A0001</div>
            <div class="search_item_content_content">兰州奥体中心 | B1</div>
          </div>
          <div class="search_item_guide">普通车位</div>
        </div>
      </div>
    </div>

    <div id="container"></div>

    <div class="containner_contain_layout">
      <img class="containner_contain_layout_top" src="./arraw_up.png" />

      <p class="scrollbar-demo-item">F1</p>
      <p class="scrollbar-demo-item">F2</p>
      <p class="scrollbar-demo-item">F3</p>

      <img class="containner_contain_layout_buttom" src="./arraw_down.png" />
    </div>
  </div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";

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
      showLocationList: false,
      action_fouce_start: false,
      action_fouce_target: false,

      edit_road_start: "我的位置",
      edit_road_target: "",

      searchList: [],
      mapLayoutDataList: [
        {
          name: "F1",
          mapUrl: "",
          roadPath: {},
        },
      ],
      top: 0,
    };
  },
  create() {},
  methods: {
    ininMap() {
      AMapLoader.load({
        key: "b456d4037e33b69b32cf75c7f0f5b219", //设置您的key
        version: "2.0",
        plugins: ["AMap.ToolBar", "AMap.Driving"],
        // AMapUI: {
        //   version: "1.1",
        //   plugins: [],
        // },
        // Loca: {
        //   version: "2.0.0",
        // },
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            zoom: 15,
            zooms: [2, 22],
            center: [103.684725, 36.085586],
          });

          let positionArr = [
            [113.357224, 34.977186],
            [114.555528, 37.727903],
            [112.106257, 36.962733],
            [109.830097, 31.859027],
            [116.449181, 39.98614],
          ];
          for (let item of positionArr) {
            let marker = new AMap.Marker({
              position: [item[0], item[1]],
            });
            this.map.add(marker);
          }

          var xyzTileLayer = new AMap.TileLayer({
            // 图块取图地址
            getTileUrl:
              "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]",
            zIndex: 100,
          });

          this.map.add(xyzTileLayer);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    onEditFouceStart() {
      console.log("foucus onEditFouceStart ");
      this.showLocationList = true;
      this.action_fouce_start = true;
      this.action_fouce_target = false;
    },

    onEditChangeTarget(v1) {
      console.log(this.edit_road_target);
    },
    onEditFouceTarget() {
      console.log("foucus onEditFouceTarget ");
      this.showLocationList = true;
      this.action_fouce_start = false;
      this.action_fouce_target = true;
    },
    click_location_current() {
      if (this.action_fouce_start) {
        this.edit_road_start = "我的位置";
      }
      if (this.action_fouce_target) {
        this.edit_road_target = "我的位置";
      }
    },
    click_location_picker() {},

    goBack() {
      this.showLocationList = false;
    },
  },
  watch: {
    edit_road_start(curVal, oldVal) {
      if (
        "我的位" == curVal ||
        "我的置" == curVal ||
        "的位置" == curVal ||
        "我位置" == curVal
      ) {
        this.edit_road_start = "";
        return;
      }
      if (this.edit_road_start == "我的位置" || !this.edit_road_start) {
        this.searchList = [];
      } else {
        this.searchList = [
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
        ];
      }
    },
    edit_road_target(curVal, oldVal) {
      if (
        "我的位" == curVal ||
        "我的置" == curVal ||
        "的位置" == curVal ||
        "我位置" == curVal
      ) {
        this.edit_road_target = "";
        return;
      }
      if (this.edit_road_target == "我的位置" || !this.edit_road_target) {
        this.searchList = [];
      } else {
        this.searchList = [
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
          { name: "电梯", des: "this is my way" },
        ];
      }
    },
  },
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
  min-height: 5.65rem;
  background-color: #ffffff;
}

.arrLeftGo {
  position: absolute;
  top: 1.1rem;
  left: 0;
  width: 3.3rem;
  height: 3.3rem;
  box-sizing: border-box;
  padding: 0.8rem;
}

.arrLeftGo_hint {
  position: absolute;
  top: 0rem;
  left: 15vw;
  width: 80vw;
  height: 5.2rem;
  box-sizing: border-box;
  background-color: #f8f8f8;
  border-radius: 0.5rem;
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

.containner_contain_layout {
  position: fixed;
  width: 2.3rem;
  height: 9.6rem;
  left: 1.8rem;
  bottom: 16rem;
  background-color: #ffffff;
  border-radius: 1.9rem;
  z-index: 2;
}

.containner_contain_layout_top {
  width: 2.3rem;
  height: 2.3rem;
  box-sizing: border-box;
  padding: 0.5rem;
}

.containner_contain_layout_buttom {
  width: 2.3rem;
  height: 2.3rem;
  box-sizing: border-box;
  padding: 0.5rem;
}

.containner_contain_layout::-webkit-scrollbar {
  display: none;
}

.scrollbar-demo-item {
  height: 1.6rem;
  width: 100%;
  text-align: center;
  color: #3065db;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 1.0rem;
}
</style>