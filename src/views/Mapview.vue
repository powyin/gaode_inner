<template>
  <div>
    <div>
      <div class="map_contain_title_name">
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
      <div class="map_contain_title_list" v-show="showLocationList">
        <div class="map_contain_title_list_divice">
          <div
            class="map_contain_title_list_location_cont"
            @click="click_location_current"
          >
            <img
              class="map_contain_title_list_location_img"
              src="./location_me.png"
            />
            <div class="map_contain_title_list_location_info">我的位置</div>
          </div>
          <div
            class="map_contain_title_list_location_cont"
            @click="click_location_picker"
          >
            <img
              class="map_contain_title_list_location_img"
              src="./location_select.png"
            />
            <div class="map_contain_title_list_location_info">地图选点</div>
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

    <div
      class="map_contain_road_switch"
      v-if="markStart && markTarget && !drivingInsideOnly"
    >
      <div class="map_road_switch_title">
        <div
          class="flex_center"
          style="flex-direction: column"
          @click="click_show_road_inside"
        >
          <div
            :class="{
              map_road_select: displayInnor,
              map_road_unselect: !displayInnor,
            }"
          >
            室内线路
          </div>
          <div
            :class="{
              map_road_select_line: displayInnor,
              map_road_unselect_line: !displayInnor,
            }"
          ></div>
        </div>
        <div
          class="flex_center"
          style="flex-direction: column"
          @click="click_show_road_outside"
        >
          <div
            :class="{
              map_road_select: !displayInnor,
              map_road_unselect: displayInnor,
            }"
          >
            室外线路
          </div>
          <div
            :class="{
              map_road_select_line: !displayInnor,
              map_road_unselect_line: displayInnor,
            }"
          ></div>
        </div>
      </div>
      <div v-if="!displayInnor" class="driving_out_info">
        {{ driving_out_info }}
      </div>
      <div v-if="!displayInnor" class="driving_out_go" @click="driving_out_go">
        <img class="driving_out_go_img" src="./driving_out_go.png" />开始导航
      </div>
      <div v-if="displayInnor" class="driving_in_go">
        <img class="driving_out_in_img" src="./driving_out_go.png" />实景导航
      </div>
    </div>

    <div
      class="map_contain_road_switch_only"
      v-if="markStart && markTarget && drivingInsideOnly"
    >
      <div class="driving_in_go_only">
        <img class="driving_out_in_img" src="./driving_out_go.png" />实景导航
      </div>
    </div>
  </div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";
import util from "./util";

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
      displayInnor: false,

      markStart: "",
      markTarget: "",

      drivingInsideOnly: false,
      driving_out_info: "",
      driving_middle: { lng: 103.680201, lat: 36.085966 },

      searchList: [],
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
      })
        .then((AMap) => {
          this.AMap = AMap;
          this.map = new AMap.Map("container", {
            zoom: 15,
            zooms: [2, 22],
            center: [103.684725, 36.085586],
          });
          this.mapDrawLeave();
          this.processRoadPath();
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

    processRoadPath() {
      console.log("processRoadPath");
      if (!this.AMap) {
        return;
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

      this.mapDrawMark();

      if (start && start.name && start.lat) {
        if (
          util.isInPolygon(
            [start.lng, start.lat],
            [
              103.686962, 36.089574, 103.68501, 36.089084, 103.68362, 36.088556,
              103.681764, 36.087463, 103.68126, 36.087012, 103.680461,
              36.086072, 103.678948, 36.083817, 103.687402, 36.081728,
              103.689623, 36.086765, 103.687113, 36.089349,
            ]
          )
        ) {
          if (this.roadPartOut) {
            this.map.remove(this.roadPartOut);
          }
          if (this.markMiddle) {
            this.map.remove(this.markMiddle);
          }
          this.drivingInsideOnly = true;
          this.mapDrawPathInSide();
          console.log("------------------------ in");
        } else {
          console.log("------------------------ out");
          this.drivingInsideOnly = false;
          this.mapDrawPathInSide();
          this.mapDrawPathOutSide();
        }
      }
    },

    mapLevelSelect(ar) {
      this.mapLayoutDataSelect = ar;
      this.mapDrawLeave();
    },

    mapDrawMark() {
      if (!this.map) {
        return;
      }

      let start = this.edit_road_start;
      if (start && start.name && start.lng && start.lat) {
        if (this.markStart) {
          this.map.remove(this.markStart);
        }
        this.markStart = new this.AMap.LabelMarker({
          icon: {
            image: "https://tsimg.supconit.net/demo/LZSport/map/pop_start.png",
            size: [25, 30],
          },
          position: [start.lng, start.lat],
          anchor: "bottom-center",
        });
        this.map.add(this.markStart);
      }

      let target = this.edit_road_target;
      if (target && target.name && target.lng && target.lat) {
        if (this.markTarget) {
          this.map.remove(this.markTarget);
        }
        this.markTarget = new this.AMap.LabelMarker({
          icon: {
            image: "https://tsimg.supconit.net/demo/LZSport/map/pop_end.png",
            size: [25, 30],
          },
          position: [target.lng, target.lat],
          anchor: "bottom-center",
        });
        this.map.add(this.markTarget);
      }
    },

    mapDrawPathInSide() {
      let start = this.edit_road_start;
      let target = this.edit_road_target;
      if (
        target &&
        start &&
        target.lng &&
        target.lat &&
        start.lng &&
        start.lat
      ) {
        if (!this.drivingInsideOnly) {
          if (this.markMiddle) {
            this.map.remove(this.markMiddle);
          }
          this.markMiddle = new this.AMap.LabelMarker({
            icon: {
              image: "https://tsimg.supconit.net/demo/LZSport/map/pop.png",
              size: [25, 35],
            },
            position: [this.driving_middle.lng, this.driving_middle.lat],
            anchor: "bottom-center",
          });
          this.map.add(this.markMiddle);
          start = this.driving_middle;
        }

        let path = [];
        path.push(new AMap.LngLat(start.lng, start.lat));
        path.push(new AMap.LngLat(target.lng, target.lat));

        if (this.roadPartInside) {
          this.map.remove(this.roadPartInside);
        }
        this.roadPartInside = new this.AMap.Polyline({
          path: path,
          isOutline: true,
          outlineColor: "#eedddd",
          borderWeight: 2,
          strokeWeight: 6,
          strokeOpacity: 0.9,
          strokeColor: "#0088ee",
          lineJoin: "round",
          showDir: true,
        });
        this.map.add(this.roadPartInside);
      }
    },

    mapDrawPathOutSide() {
      let start = this.edit_road_start;
      let target = this.edit_road_target;
      if (
        target &&
        start &&
        target.lng &&
        target.lat &&
        start.lng &&
        start.lat
      ) {
        var drivingOption = {
          policy: this.AMap.DrivingPolicy.LEAST_TIME,
        };
        var driving = new this.AMap.Driving(drivingOption);
        let that = this;
        driving.search(
          new this.AMap.LngLat(start.lng, start.lat),
          new this.AMap.LngLat(
            this.driving_middle.lng,
            this.driving_middle.lat
          ),
          function (status, result) {
            if (status === "complete") {
              if (result.routes && result.routes.length) {
                let route = result.routes[0];
                let time = route.time;
                time = Math.floor(time / 60);
                let driving_out_time = "";
                let driving_out_road = "";
                if (time > 60) {
                  let h = Math.floor(time / 60);
                  time = h + "小时-" + (time - h * 60) + "分钟";
                  driving_out_time = time;
                } else {
                  driving_out_time = time + "分钟";
                }
                let distance = route.distance;
                if (distance > 1000) {
                  distance = distance / 1000;
                  driving_out_road = distance + "公里";
                } else {
                  driving_out_road = distance + "米";
                }
                that.driving_out_info =
                  driving_out_time + "  " + driving_out_road;

                var path = [];
                for (var i = 0, l = route.steps.length; i < l; i++) {
                  var step = route.steps[i];
                  for (var j = 0, n = step.path.length; j < n; j++) {
                    path.push(step.path[j]);
                  }
                }

                path.push(
                  new AMap.LngLat(
                    that.driving_middle.lng,
                    that.driving_middle.lat
                  )
                );
                if (that.roadPartOut) {
                  that.map.remove(that.roadPartOut);
                }
                that.roadPartOut = new that.AMap.Polyline({
                  path: path,
                  isOutline: true,
                  outlineColor: "#ffeeee",
                  borderWeight: 2,
                  strokeWeight: 6,
                  strokeOpacity: 0.9,
                  strokeColor: "#0091ff",
                  lineJoin: "round",
                  showDir: true,
                });
                that.map.add(that.roadPartOut);

                that.map.setFitView([
                  that.markStart,
                  that.markTarget,
                  that.roadPartOut,
                ]);
                console.log("绘制驾车路线完成");
              }
            } else {
              console.log("获取驾车数据失败：" + result);
            }
          }
        );
      }
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
        zIndex: 100,
      });
      this.map.add(this.xyzTileLayer);
    },

    click_location_picker() {
      this.$router.push({
        path: "/mapselectlocation",
      });
    },
    click_show_road_inside() {
      this.displayInnor = true;
      this.map.setFitView([this.roadPartInside]);
    },
    click_show_road_outside() {
      this.displayInnor = false;
      this.map.setFitView([this.roadPartOut]);
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
          this.processRoadPath();
          return;
        }
        this.processRoadPath();

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
          this.processRoadPath();
          return;
        }
        this.processRoadPath();

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
      this.processRoadPath();
    }, 100);
  },
};
</script>
<style scoped>
#container {
  height: calc(100vh + 50px);
  width: 100%;
  padding: 0px;
  margin: 0px;
  position: fixed;
  left: 0px;
  right: 0px;
}
.map_contain_title_name {
  position: fixed;
  z-index: 10;
  width: 100%;
  min-height: 5.65rem;
  background-color: #ffffff;
  top: 0px;
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

.map_contain_title_list {
  position: relative;
  top: 0;
  padding-top: 5.64rem;
  left: 0px;
  right: 0px;
  width: 100vw;
  box-sizing: border-box;
  min-height: 100vh;

  background-color: #ffffff;
  z-index: 5;
}

.map_contain_title_list_divice {
  background-color: #f8f8f8;
  width: 100vw;
  height: 4.1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.map_contain_title_list_location_cont {
  background-color: #ffffff;
  width: 40vw;
  height: 2.6rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map_contain_title_list_location_img {
  width: 1.3rem;
  height: 1.3rem;
}
.map_contain_title_list_location_info {
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
  width: 1.99rem;
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
  width: 1.8rem;
  height: 1.8rem;
  box-sizing: border-box;
  padding: 0.5rem;
  border-radius: 1.8rem;
}

.map_contain_leve_buttom {
  width: 1.8rem;
  height: 1.8rem;
  box-sizing: border-box;
  padding: 0.5rem;
  border-radius: 1.8rem;
}

.scrollbar-demo-item {
  height: 1.68rem;
  text-align: center;
  color: #3065db;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 0.73rem;
  box-sizing: border-box;
  padding-left: 0.1rem;
  padding-top: 0.15rem;
}

.scrollbar-demo-item_unselct {
  height: 1.68rem;
  text-align: center;
  color: rgba(141, 153, 165, 1);
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 0.73rem;
  box-sizing: border-box;
  padding-left: 0.1rem;
  padding-top: 0.15rem;
}

.map_contain_road_switch {
  position: fixed;
  bottom: 0px;
  width: 100vw;
  height: 7.8rem;
  background: #ffffff;
  z-index: 5;
}

.map_contain_road_switch_only {
  position: fixed;
  bottom: 0px;
  width: 100vw;
  height: 3.8rem;
  background: #ffffffff;
  z-index: 5;
}

.flex_center {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.map_road_switch_title {
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  width: 100vw;
  padding-left: 10vw;
  padding-right: 10vw;
  background-color: rgba(245, 247, 255, 1);
  box-sizing: border-box;
  padding-top: 0.8rem;
  padding-bottom: 0.35rem;
}
.map_road_select {
  color: rgba(48, 101, 219, 1);
  font-size: 0.9rem;
  box-sizing: border-box;
  padding-bottom: 0.5rem;
  line-height: 1;
}
.map_road_select_line {
  background-color: rgba(48, 101, 219, 1);
  width: 1.2rem;
  height: 0.1rem;
}
.map_road_unselect {
  color: rgba(141, 153, 165, 1);
  font-size: 0.9rem;
  box-sizing: border-box;
  padding-bottom: 0.5rem;
  line-height: 1;
}
.map_road_unselect_line {
  background-color: #00000000;
  width: 1.2rem;
  height: 0.1rem;
}
.driving_out_info {
  display: block;
  width: 100vw;
  box-sizing: border-box;
  padding-top: 0.5rem;
  font-size: 1rem;
  padding-bottom: 0.8rem;
  line-height: 1;
  padding-left: 2.1rem;
  color: rgba(45, 51, 57, 1);
}

.driving_out_go {
  width: calc(100vw - 3.9rem);
  border-radius: 1.2rem;
  margin-left: 1.9rem;
  box-sizing: border-box;
  padding-top: 0.6rem;
  font-size: 0.8rem;
  padding-bottom: 0.6rem;
  line-height: 1;
  padding-left: 1.6rem;
  color: #ffffff;
  background-color: rgba(48, 101, 219, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.driving_out_go_img {
  display: block;
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 0.5rem;
  padding-top: 0rem;
  box-sizing: border-box;
}

.driving_in_go {
  width: calc(100vw - 3.9rem);
  border-radius: 1.2rem;
  margin-left: 1.9rem;
  margin-top: 2.3rem;
  box-sizing: border-box;
  padding-top: 0.6rem;
  font-size: 0.8rem;
  padding-bottom: 0.6rem;
  line-height: 1;
  padding-left: 1.6rem;
  color: #ffffff;
  background-color: rgba(48, 101, 219, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.driving_in_go_only {
  width: calc(100vw - 3.9rem);
  border-radius: 1.2rem;
  margin-left: 1.9rem;
  margin-top: 0.69rem;
  box-sizing: border-box;
  padding-top: 0.6rem;
  font-size: 0.8rem;
  padding-bottom: 0.6rem;
  line-height: 1;
  padding-left: 1.6rem;
  color: #ffffff;
  background-color: rgba(48, 101, 219, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.driving_out_in_img {
  display: block;
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 0.5rem;
  padding-top: 0rem;
  box-sizing: border-box;
}
</style>




 