<template>
  <div>
    <div>
      <div class="map-title">
        <div class="arrLeftGo_hint"></div>
        <img
          class="arrLeftGo"
          src="./left_arraw.png"
          @click="showLocationList = false"
        />
        <img class="arrLeftGo_switch_road" src="./switch_road_icon.png" />
        <img
          class="arrLeftGo_switch"
          src="./switch_road.png"
          @click="switch_road"
        />

        <input
          class="road_start"
          placeholder="请输入起点"
          v-model="edit_road_start.name"
          @focus="onEditFouceStart"
        />
        <input
          class="road_target"
          placeholder="请输入终点"
          v-model="edit_road_target.name"
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

      markStart: "",
      markTarget: "",

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
  computed: {
    edit_road_target() {
      return this.$store.state.point_target;
    },
    edit_road_start() {
      return this.$store.state.point_start;
    },
  },
  create() {
    console.log("create");
  },
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
          console.log("get amap");
          this.AMap = AMap;
          this.map = new AMap.Map("container", {
            zoom: 15,
            zooms: [2, 22],
            center: [103.684725, 36.085586],
          });

          var xyzTileLayer = new AMap.TileLayer({
            // 图块取图地址
            getTileUrl:
              "https://yd-mobile.cn/lanzhou/api/getPngData?z=[z]&x=[x]&y=[y]",
            zIndex: 100,
          });

          this.map.add(xyzTileLayer);
          this.doRoadComputer();
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
    onEditFouceTarget() {
      console.log("foucus onEditFouceTarget ");
      this.showLocationList = true;
      this.action_fouce_start = false;
      this.action_fouce_target = true;
    },
    click_location_current() {
      if (this.action_fouce_start) {
        this.$store.commit("SET_POINT_START", {
          pos: [],
          name: "我的位置",
        });
      }
      if (this.action_fouce_target) {
        this.$store.commit("SET_POINT_TARGET", {
          pos: [],
          name: "我的位置",
        });
      }
    },

    doRoadComputer() {
      console.log("doRoadComputer");
      if (!this.AMap) {
        return;
      }

      if (this.markStart) {
        this.map.remove(this.markStart);
      }
      let start = this.edit_road_start;
      if (!start || !start.name || !start.lat) {
        if (
          this.$route.query.sn &&
          this.$route.query.slat &&
          this.$route.query.slng
        ) {
          let start = {
            lng: this.$route.query.slng,
            lat: this.$route.query.slat,
            name: this.$route.query.sn,
          };
          this.$store.commit("SET_POINT_START", start);
        }
      }

      if (start && start.name && start.lng && start.lat) {
        this.markStart = new this.AMap.LabelMarker({
          icon: {
            image: "https://tsimg.supconit.net/demo/LZSport/map/pop_start.png",
            size: [23, 33],
          },
          position: [start.lng, start.lat],
          anchor: "bottom-center",
        });
        this.map.add(this.markStart);
      }

      if (this.markTarget) {
        this.map.remove(this.markTarget);
      }
      let target = this.edit_road_target;
      if (!target || !target.name || !target.lat) {
        if (
          this.$route.query.tn &&
          this.$route.query.tlat &&
          this.$route.query.tlng
        ) {
          target = {
            lng: this.$route.query.tlng,
            lat: this.$route.query.tlat,
            name: this.$route.query.tn,
          };
          this.$store.commit("SET_POINT_TARGET", target);
        }
      }

      if (target && target.name && target.lng && target.lat) {
        this.markTarget = new this.AMap.LabelMarker({
          icon: {
            image:
              "https://tsimg.supconit.net/demo/LZSport/map/pop_end.png",
            size: [23, 33],
          },
          position: [target.lng, target.lat],
          anchor: "bottom-center",
        });
        this.map.add(this.markTarget);
      }

      //todo 路径计算
    },

    click_location_picker() {
      this.$router.push({
        path: "/mapselectlocation",
      });
    },
  },
  watch: {
    edit_road_start: {
      handler(newValue, oldVal) {
        console.log("handle start");
        console.log(newValue);
        let curVal = newValue.name;
        if (
          "我的位" == curVal ||
          "我的置" == curVal ||
          "的位置" == curVal ||
          "我位置" == curVal
        ) {
          newValue.name = "";
          newValue.ln = [];
          this.doRoadComputer();
          return;
        }
        this.doRoadComputer();

        if (curVal == "我的位置" || !curVal) {
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
        console.log(this.searchList);
      },
      deep: true,
    },
    edit_road_target: {
      handler(newValue, oldVal) {
        // console.log("handle target");
        // console.log(newValue);
        let curVal = newValue.name;
        if (
          "我的位" == curVal ||
          "我的置" == curVal ||
          "的位置" == curVal ||
          "我位置" == curVal
        ) {
          newValue.name = "";
          newValue.ln = [];
          this.doRoadComputer();
          return;
        }
        this.doRoadComputer();

        if (curVal == "我的位置" || !curVal) {
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
      deep: true,
    },
  },

  mounted() {
    if (!this.inInit) {
      this.ininMap();
      this.inInit = true;
    }
    setTimeout(() => {
      this.doRoadComputer();
    }, 100);
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
  width: 1.8rem;
  left: 1.2rem;
  bottom: 7.8rem;
  background-color: #ffffff;
  border-radius: 2rem;
  box-shadow: 0px 0px 6px #888888;
  padding: 0px;
  margin: 0px;
  z-index: 2;
}

.containner_contain_layout_top {
  width: 1.8rem;
  height: 1.8rem;
  box-sizing: border-box;
  padding: 0.5rem;
  border-radius: 2rem;
}

.containner_contain_layout_buttom {
  width: 1.8rem;
  height: 1.8rem;
  box-sizing: border-box;
  padding: 0.5rem;
  border-radius: 2rem;
}

.scrollbar-demo-item {
  height: 1.68rem;
  width: 100%;
  text-align: center;
  color: #3065db;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 0.8rem;
  box-sizing: border-box;
  padding-top: 0.1rem;
}
</style>




 