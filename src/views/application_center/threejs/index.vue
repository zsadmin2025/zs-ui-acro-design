<template>
  <zs-container layout="header-main-footer">
    <template #header>
      <div class="map-header">
        <span class="header-label">当前楼层</span>
        <span class="header-title">{{ mallName }} {{ currentFloorLabel }}</span>
      </div>
    </template>
    <template #main-body>
      <div ref="containerRef" class="indoor-map-container">
        <div class="floor-panel">
          <div class="floor-panel-header">
            <icon-layers />
            <span>多层</span>
          </div>
          <div class="floor-panel-arrow-up" @click="goUpFloor">
            <icon-up />
          </div>
          <div
            v-for="floor in floors"
            :key="floor.id"
            class="floor-panel-item"
            :class="{ active: currentFloor === floor.id }"
            @click="selectFloor(floor.id)"
          >
            {{ floor.label }}
          </div>
          <div class="floor-panel-arrow-down" @click="goDownFloor">
            <icon-down />
          </div>
        </div>

        <div class="bottom-controls">
          <div class="control-hints">
            <span>左键平移</span>
            <span>右键旋转</span>
            <span>滚轮缩放</span>
          </div>
        </div>

        <div class="map-controls">
          <!-- 1. 指南针 -->
          <div
            class="compass"
            :title="'拖拽旋转地图，点击复位'"
            @mousedown="onCompassMouseDown"
            @click="resetCompass"
          >
            <div class="compass-ring">
              <svg
                class="compass-needle"
                viewBox="0 0 52 52"
                width="52"
                height="52"
                :style="{ transform: `rotate(${-compassAngle}deg)` }"
              >
                <!-- 北箭头 — 红色，锐利三角形 -->
                <polygon points="26,4 18,24 26,21 34,24" fill="#e74c3c" />
                <!-- 南箭头 — 灰色 -->
                <polygon points="26,48 18,28 26,31 34,28" fill="#bbb" />
                <!-- 中心圆点 -->
                <circle cx="26" cy="26" r="2.5" fill="#666" />
              </svg>
            </div>
          </div>

          <!-- 2. 左旋转 / 右旋转 -->
          <div class="ctrl-btn" title="向左旋转45°" @click="rotateLeft">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="#333"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 3a9 9 0 1 0 9 9" />
              <path d="M12 3l5 4-5 5" />
            </svg>
          </div>
          <div class="ctrl-btn" title="向右旋转45°" @click="rotateRight">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="#333"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 21a9 9 0 1 0-9-9" />
              <path d="M12 21l-5-4 5-5" />
            </svg>
          </div>

          <!-- 3. 3D/2D 切换 -->
          <div
            class="ctrl-btn"
            :title="is3D ? '切换到 2D 视图' : '切换到 3D 视图'"
            @click="toggle3D"
          >
            <span class="ctrl-btn-text">{{ is3D ? '3D' : '2D' }}</span>
          </div>

          <!-- 4. 定位靶心 -->
          <div class="ctrl-btn" title="定位到当前位置" @click="resetView">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="#333"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="12" cy="12" r="1.5" fill="#333" stroke="none" />
              <path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
            </svg>
          </div>

          <!-- 5. 缩放 -->
          <div class="zoom-controls">
            <div class="zoom-btn" title="放大" @click="zoomIn">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="#333"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div class="zoom-btn" title="缩小" @click="zoomOut">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="#333"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M5 12h14" />
              </svg>
            </div>
          </div>

          <!-- 6. 全屏 -->
          <div class="ctrl-btn" title="全屏" @click="toggleFullscreen">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="#333"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
            <span class="ctrl-btn-label">全屏</span>
          </div>
        </div>

        <div class="scale-bar">
          <div class="scale-line"></div>
          <span class="scale-text">30m</span>
        </div>

        <div class="facility-bar">
          <div
            v-for="fac in shortcutFacilities"
            :key="fac.type"
            class="fac-btn"
            @click="locateFacility(fac.type)"
          >
            <component :is="fac.icon" style="color: #fff; font-size: 18px" />
            <span style="color: #fff; font-size: 10px">{{ fac.label }}</span>
          </div>
        </div>

        <div class="search-box">
          <a-input-search
            v-model="searchText"
            placeholder="搜索店铺、设施..."
            allow-clear
            @search="handleSearch"
          />
        </div>

        <a-modal
          v-model:visible="routeModalVisible"
          title="路线规划"
          @ok="confirmRoute"
          @cancel="cancelRoute"
        >
          <a-form :model="routeForm" layout="vertical">
            <a-form-item label="起点">
              <a-select
                v-model="routeForm.start"
                placeholder="选择起点"
                :options="locationOptions"
              />
            </a-form-item>
            <a-form-item label="终点">
              <a-select
                v-model="routeForm.end"
                placeholder="选择终点"
                :options="locationOptions"
              />
            </a-form-item>
          </a-form>
        </a-modal>

        <div
          ref="threeContainerRef"
          class="three-container"
          @click="handleCanvasClick"
        ></div>

        <div v-if="popupInfo" class="info-popup" :style="popupStyle">
          <div class="popup-title">{{ popupInfo.name }}</div>
          <div class="popup-type">{{ popupInfo.typeLabel }}</div>
          <div v-if="popupInfo.description" class="popup-desc">{{
            popupInfo.description
          }}</div>
          <a-button type="primary" size="mini" @click="navigateTo(popupInfo)"
            >导航到这里</a-button
          >
        </div>

        <!-- 导航信息面板 -->
        <div v-if="navigationState.active" class="navigation-panel">
          <div class="nav-header">
            <span class="nav-title">导航中</span>
            <a-button size="mini" @click="stopNavigation">结束</a-button>
          </div>

          <div class="nav-info">
            <div class="info-row">
              <span class="label">剩余距离:</span>
              <span class="value">{{
                formatDistance(navigationState.remainingDistance)
              }}</span>
            </div>
            <div class="info-row">
              <span class="label">预计时间:</span>
              <span class="value">{{ formatTime(calculateETA()) }}</span>
            </div>
            <div class="info-row">
              <span class="label">当前楼层:</span>
              <span class="value">{{ getCurrentFloorLabel() }}</span>
            </div>
          </div>

          <div class="nav-progress">
            <a-progress
              :percent="getProgressPercent()"
              :stroke-color="'#1890ff'"
            />
          </div>

          <div class="nav-controls">
            <a-button size="small" @click="togglePause">
              {{ navigationState.paused ? '继续' : '暂停' }}
            </a-button>

            <div class="speed-control">
              <span>速度:</span>
              <a-slider
                v-model="navigationState.speed"
                :min="0.5"
                :max="3"
                :step="0.5"
                style="width: 100px"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </zs-container>
</template>

<script setup>
  /* eslint-disable no-use-before-define */
  /* eslint-disable no-plusplus */
  /* eslint-disable no-console */
  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-continue */
  /* eslint-disable no-shadow */
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { IconLayers, IconUp, IconDown } from '@arco-design/web-vue/es/icon';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import geojsonData from './mapData.geo.json';

  // 导航系统相关变量
  const clock = new THREE.Clock(); // 用于计算deltaTime
  let navGraph = { nodes: [], edges: [] }; // 导航图
  let navMarker = null; // 导航标记
  let routeSegments = []; // 路径段数组
  const navigationState = ref({
    active: false,
    paused: false,
    speed: 1.0,
    currentIndex: 0,
    progress: 0,
    totalDistance: 0,
    traveledDistance: 0,
    remainingDistance: 0,
  });

  function parseGeoJSON(gj) {
    const mallOutline = [];
    const corridors = [];
    const shopData = {};
    const facilityData = {};
    const facilityIcons = {};
    const typeLabels = {};
    let mallName = '';
    let floors = [];

    const meta = gj.metadata || {};
    mallName = meta.mallName || '';
    floors = meta.floors || [];
    Object.assign(facilityIcons, meta.facilityIcons || {});
    Object.assign(typeLabels, meta.typeLabels || {});

    floors.forEach((floor) => {
      shopData[floor.id] = [];
      facilityData[floor.id] = [];
    });

    gj.features.forEach((feature) => {
      const props = feature.properties || {};
      const geom = feature.geometry || {};

      if (props.category === 'building') {
        const coords = geom.coordinates?.[0] || [];
        coords.forEach((pt) => {
          mallOutline.push({ x: pt[0], y: pt[1] });
        });
        if (mallOutline.length > 0) {
          mallOutline.pop();
        }
      } else if (props.category === 'corridor') {
        const coords = geom.coordinates?.[0] || [];
        if (coords.length >= 4) {
          const xs = coords.slice(0, 4).map((p) => p[0]);
          const ys = coords.slice(0, 4).map((p) => p[1]);
          corridors.push({
            x: Math.min(...xs),
            y: Math.min(...ys),
            w: Math.max(...xs) - Math.min(...xs),
            h: Math.max(...ys) - Math.min(...ys),
            color: props.color || '#e8e8e8',
            isAtrium: props.subcategory === 'atrium',
          });
        }
      } else if (props.category === 'shop') {
        const coords = geom.coordinates?.[0] || [];
        if (coords.length >= 4) {
          const xs = coords.slice(0, 4).map((p) => p[0]);
          const ys = coords.slice(0, 4).map((p) => p[1]);
          const x = Math.min(...xs);
          const y = Math.min(...ys);
          const w = Math.max(...xs) - x;
          const h = Math.max(...ys) - y;
          const floor = props.floor || '2f';
          if (!shopData[floor]) shopData[floor] = [];
          shopData[floor].push({
            id: props.id,
            name: props.name,
            x,
            y,
            w,
            h,
            color: props.color || '#b3d9ff',
            type: props.shopType || 'retail',
          });
        }
      } else if (props.category === 'facility') {
        const coords = geom.coordinates || [];
        const floor = props.floor || '2f';
        if (!facilityData[floor]) facilityData[floor] = [];
        facilityData[floor].push({
          id: props.id,
          type: props.facilityType || 'stairs',
          label: props.name || '',
          x: coords[0],
          y: coords[1],
          icon: props.facilityType || 'stairs',
        });
      }
    });

    return {
      mallName,
      floors,
      mallOutline,
      corridors,
      shopData,
      facilityData,
      facilityIcons,
      typeLabels,
    };
  }

  const mapData = parseGeoJSON(geojsonData);
  const { mallName } = mapData;
  const containerRef = ref(null);
  const threeContainerRef = ref(null);
  const searchText = ref('');
  const currentFloor = ref('2f');
  const routeModalVisible = ref(false);
  const routeForm = ref({ start: null, end: null });
  const popupInfo = ref(null);
  const popupStyle = ref({ left: '0px', top: '0px' });
  const is3D = ref(true); // 默认3D模式
  const compassAngle = ref(0);
  const compassDragging = ref(false);
  const gyroEnabled = ref(false);
  const isFullscreen = ref(false);
  let gyroHandler = null;

  let scene = null;
  let perspectiveCamera = null;
  let orthoCamera = null;
  let camera = null;
  let renderer = null;
  let controls = null;
  let raycaster = null;
  let animFrameId = null;
  let routeLine = null;
  let routeMarker = null;
  const routePoints = ref([]);

  const floorGroups = {};

  const { floors } = mapData;
  const { mallOutline } = mapData;
  const { shopData } = mapData;
  const { facilityData } = mapData;
  const { facilityIcons } = mapData;
  const { typeLabels } = mapData;

  const SHOP_HEIGHT = 12;

  const currentFloorLabel = computed(() => {
    const f = floors.find((fl) => fl.id === currentFloor.value);
    return f ? f.label : '';
  });

  const shortcutFacilities = [
    {
      type: 'elevator',
      label: '电梯',
      color: '#1890ff',
      icon: 'IconRestroom',
    },
    {
      type: 'restroom',
      label: '卫生间',
      color: '#722ed1',
      icon: 'IconRestroom',
    },
  ];

  const currentShops = computed(() => shopData[currentFloor.value] || []);
  const currentFacilities = computed(
    () => facilityData[currentFloor.value] || [],
  );

  const allLocations = computed(() => {
    const shops = currentShops.value.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      x: s.x + s.w / 2,
      y: s.y + s.h / 2,
    }));
    const facs = currentFacilities.value.map((f) => ({
      id: f.id,
      name: f.label,
      type: f.type,
      x: f.x,
      y: f.y,
    }));
    return [...shops, ...facs];
  });

  const locationOptions = computed(() =>
    allLocations.value.map((loc) => ({ value: loc.id, label: loc.name })),
  );

  function getTypeLabel(type) {
    return typeLabels[type] || type;
  }

  function getMapBounds() {
    const xs = mallOutline.map((p) => p.x);
    const ys = mallOutline.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }

  function getMapCenter() {
    const b = getMapBounds();
    return { x: (b.minX + b.maxX) / 2, z: (b.minY + b.maxY) / 2 };
  }

  function getMapSize() {
    const b = getMapBounds();
    return { w: b.maxX - b.minX, h: b.maxY - b.minY };
  }

  function createTextTexture(text, options = {}) {
    const canvas = document.createElement('canvas');
    const fontSize = options.fontSize || 32;
    const padding = options.padding || 12;
    const ctx = canvas.getContext('2d');
    ctx.font = `bold ${fontSize}px "Microsoft YaHei", sans-serif`;
    const textWidth = ctx.measureText(text).width;
    canvas.width = textWidth + padding * 2;
    canvas.height = fontSize + padding * 2;
    ctx.font = `bold ${fontSize}px "Microsoft YaHei", sans-serif`;

    // 透明背景时不绘制背景
    if (options.bgColor !== 'transparent') {
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = options.bgColor || 'rgba(255,255,255,0.95)';
      if (options.rounded) {
        const r = 6;
        const w = canvas.width;
        const h = canvas.height;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h);
        ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = options.color || '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return { texture, width: canvas.width, height: canvas.height };
  }

  function createShopMeshes(floorId) {
    const group = new THREE.Group();
    const shops = shopData[floorId] || [];
    const floorIndex = floors.findIndex((f) => f.id === floorId);
    const baseY = floorIndex * SHOP_HEIGHT;

    shops.forEach((shop) => {
      // 参考图：非常扁平的房间效果
      const roomHeight = SHOP_HEIGHT * 0.4;
      const geometry = new THREE.BoxGeometry(shop.w, roomHeight, shop.h);
      const shopColor = new THREE.Color(shop.color);

      // 顶部保持原色，侧面明显变暗（模拟墙边阴影）
      const topColor = shopColor.clone();
      const sideColor = shopColor.clone().lerp(new THREE.Color(0x000000), 0.4);

      const materials = [
        new THREE.MeshLambertMaterial({ color: sideColor }),
        new THREE.MeshLambertMaterial({ color: sideColor }),
        new THREE.MeshLambertMaterial({ color: topColor }),
        new THREE.MeshLambertMaterial({ color: shopColor }),
        new THREE.MeshLambertMaterial({ color: sideColor }),
        new THREE.MeshLambertMaterial({ color: sideColor }),
      ];

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.set(
        shop.x + shop.w / 2,
        baseY + roomHeight / 2,
        shop.y + shop.h / 2,
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = {
        category: 'shop',
        id: shop.id,
        name: shop.name,
        type: shop.type,
        floorId,
      };
      group.add(mesh);

      // 参考图：清晰的白色轮廓线
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2.5,
        transparent: true,
        opacity: 0.95,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      mesh.add(wireframe);

      // 参考图：清晰可读的文字标签
      const maxChars = Math.max(8, Math.floor(shop.w / 7));
      const fontSize = Math.min(60, Math.max(30, shop.w / 2.5));
      const displayName =
        shop.name.length > maxChars
          ? `${shop.name.substring(0, maxChars)}..`
          : shop.name;
      const { texture, width, height } = createTextTexture(displayName, {
        fontSize,
        bgColor: 'transparent',
        rounded: false,
        color: '#1a1a1a',
        fontWeight: 'bold',
      });
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      const scale = 0.25;
      sprite.scale.set(width * scale, height * scale, 1);
      sprite.position.set(
        shop.x + shop.w / 2,
        baseY + roomHeight + 5,
        shop.y + shop.h / 2,
      );
      group.add(sprite);
    });

    return group;
  }

  function createFacilitySprites(floorId) {
    const group = new THREE.Group();
    const facilities = facilityData[floorId] || [];
    const floorIndex = floors.findIndex((f) => f.id === floorId);
    const baseY = floorIndex * SHOP_HEIGHT;

    facilities.forEach((fac) => {
      const info = facilityIcons[fac.type] || { color: '#999' };
      const symbols = { escalator: '⬆', stairs: '⬆', restroom: '🚻' };

      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');

      ctx.beginPath();
      ctx.arc(32, 28, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = info.color;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = '22px sans-serif';
      ctx.fillStyle = info.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbols[fac.type] || '?', 32, 28);

      ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = '#555';
      ctx.fillText(fac.label, 32, 66);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(30, 38, 1);
      sprite.position.set(fac.x, baseY + SHOP_HEIGHT + 10, fac.y);
      sprite.userData = {
        category: 'facility',
        id: fac.id,
        name: fac.label,
        type: fac.type,
        floorId,
      };
      group.add(sprite);
    });

    return group;
  }

  function buildFloorGroups() {
    floors.forEach((floor) => {
      const group = new THREE.Group();
      group.name = floor.id;
      group.visible = floor.id === currentFloor.value;

      const shopMeshes = createShopMeshes(floor.id);
      group.add(shopMeshes);

      const facSprites = createFacilitySprites(floor.id);
      group.add(facSprites);

      floorGroups[floor.id] = group;
      scene.add(group);
    });
  }

  // ==================== 导航系统函数 ====================

  // 构建导航图
  function buildNavGraph() {
    navGraph = { nodes: [], edges: [] };
    const spacing = 40;
    const corridorRects = {}; // 存储走廊矩形用于交集检测

    // 1. 从走廊生成节点（为每个有内容的楼层创建走廊节点）
    floors.forEach((floor) => {
      const hasContent =
        (shopData[floor.id] && shopData[floor.id].length > 0) ||
        (facilityData[floor.id] && facilityData[floor.id].length > 0);
      if (!hasContent) return;

      mapData.corridors.forEach((corridor, cIdx) => {
        const { x: cx, y: cy, w: cw, h: ch } = corridor;

        // 沿走廊四条边密集放置节点（每 ~40 单位一个），
        // A* 路径自然沿走廊边缘走，不斜穿房间
        const edgeNodes = [];

        // 顶边: (x → x+w, y)
        for (let px = cx; px <= cx + cw + 0.1; px += spacing) {
          const id = `c_${floor.id}_${cIdx}_t${edgeNodes.length}`;
          const node = {
            id,
            x: px,
            y: cy,
            floorId: floor.id,
            type: 'corridor',
          };
          navGraph.nodes.push(node);
          edgeNodes.push(node);
        }
        // 底边: (x → x+w, y+h)
        for (let px = cx; px <= cx + cw + 0.1; px += spacing) {
          const id = `c_${floor.id}_${cIdx}_b${edgeNodes.length}`;
          const node = {
            id,
            x: px,
            y: cy + ch,
            floorId: floor.id,
            type: 'corridor',
          };
          navGraph.nodes.push(node);
          edgeNodes.push(node);
        }
        // 左边: (x, y → y+h)
        for (let py = cy; py <= cy + ch + 0.1; py += spacing) {
          const id = `c_${floor.id}_${cIdx}_l${edgeNodes.length}`;
          const node = {
            id,
            x: cx,
            y: py,
            floorId: floor.id,
            type: 'corridor',
          };
          navGraph.nodes.push(node);
          edgeNodes.push(node);
        }
        // 右边: (x+w, y → y+h)
        for (let py = cy; py <= cy + ch + 0.1; py += spacing) {
          const id = `c_${floor.id}_${cIdx}_r${edgeNodes.length}`;
          const node = {
            id,
            x: cx + cw,
            y: py,
            floorId: floor.id,
            type: 'corridor',
          };
          navGraph.nodes.push(node);
          edgeNodes.push(node);
        }

        // 连接相邻边缘节点（同一走廊内）
        for (let i = 0; i < edgeNodes.length; i++) {
          for (let j = i + 1; j < edgeNodes.length; j++) {
            const dx = edgeNodes[i].x - edgeNodes[j].x;
            const dy = edgeNodes[i].y - edgeNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < spacing * 1.1) {
              navGraph.edges.push({
                from: edgeNodes[i].id,
                to: edgeNodes[j].id,
                weight: dist,
              });
              navGraph.edges.push({
                from: edgeNodes[j].id,
                to: edgeNodes[i].id,
                weight: dist,
              });
            }
          }
        }

        // 记录走廊矩形用于后续交集检测
        if (!corridorRects[cIdx]) corridorRects[cIdx] = {};
        corridorRects[cIdx][floor.id] = { x: cx, y: cy, w: cw, h: ch };
      });
    });

    // 2. 连接不同走廊在交集处的节点（仅当两条走廊物理相交时）
    const allCorrNodes = navGraph.nodes.filter((n) => n.type === 'corridor');
    // 按楼层分组
    const nodesByFloor = {};
    allCorrNodes.forEach((n) => {
      if (!nodesByFloor[n.floorId]) nodesByFloor[n.floorId] = [];
      nodesByFloor[n.floorId].push(n);
    });

    Object.keys(nodesByFloor).forEach((floorId) => {
      const nodes = nodesByFloor[floorId];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          // 判断两个节点是否属于不同的走廊
          // 通过 id 前缀区分: "c_floorId_corridorIdx_..."
          const id1Parts = n1.id.split('_');
          const id2Parts = n2.id.split('_');
          if (id1Parts.length < 3 || id2Parts.length < 3) continue;
          // 提取走廊索引: "c_{floorId}_{corridorIdx}_{...}"
          const cIdx1 = parseInt(id1Parts[2], 10);
          const cIdx2 = parseInt(id2Parts[2], 10);
          if (cIdx1 === cIdx2 || Number.isNaN(cIdx1) || Number.isNaN(cIdx2))
            continue;

          // 检查两个节点是否都在对方走廊矩形内（即位于交集区域）
          const r1 = corridorRects[cIdx1]?.[floorId];
          const r2 = corridorRects[cIdx2]?.[floorId];
          if (!r1 || !r2) continue;

          const inR1 =
            n2.x >= r1.x - 0.5 &&
            n2.x <= r1.x + r1.w + 0.5 &&
            n2.y >= r1.y - 0.5 &&
            n2.y <= r1.y + r1.h + 0.5;
          const inR2 =
            n1.x >= r2.x - 0.5 &&
            n1.x <= r2.x + r2.w + 0.5 &&
            n1.y >= r2.y - 0.5 &&
            n1.y <= r2.y + r2.h + 0.5;

          if (inR1 || inR2) {
            const dist = Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2);
            if (dist < spacing * 2) {
              navGraph.edges.push({ from: n1.id, to: n2.id, weight: dist });
              navGraph.edges.push({ from: n2.id, to: n1.id, weight: dist });
            }
          }
        }
      }
    });

    // 3. 为每个房间添加接入节点（放在朝向走廊的边缘上，不放在房间中心）
    floors.forEach((floor) => {
      const shops = shopData[floor.id] || [];
      shops.forEach((shop) => {
        const shopCx = shop.x + shop.w / 2;
        const shopCy = shop.y + shop.h / 2;

        // 先找到最近的走廊节点
        let nearestNode = null;
        let minDist = Infinity;
        navGraph.nodes.forEach((node) => {
          if (node.type === 'corridor' && node.floorId === floor.id) {
            const dist = Math.sqrt(
              (shopCx - node.x) ** 2 + (shopCy - node.y) ** 2,
            );
            if (dist < minDist) {
              minDist = dist;
              nearestNode = node;
            }
          }
        });

        // 将店铺节点放在矩形边界上离最近走廊最近的位置
        let nodeX = shopCx;
        let nodeY = shopCy;
        if (nearestNode && minDist > 0) {
          nodeX = Math.max(shop.x, Math.min(shop.x + shop.w, nearestNode.x));
          nodeY = Math.max(shop.y, Math.min(shop.y + shop.h, nearestNode.y));
        }

        const shopNode = {
          id: `s_${shop.id}`,
          x: nodeX,
          y: nodeY,
          floorId: floor.id,
          type: 'shop',
          shopId: shop.id,
        };
        navGraph.nodes.push(shopNode);

        if (nearestNode) {
          const edgeDist = Math.sqrt(
            (nodeX - nearestNode.x) ** 2 + (nodeY - nearestNode.y) ** 2,
          );
          navGraph.edges.push({
            from: shopNode.id,
            to: nearestNode.id,
            weight: edgeDist,
          });
          navGraph.edges.push({
            from: nearestNode.id,
            to: shopNode.id,
            weight: edgeDist,
          });
        }
      });
    });

    // 4. 添加设施节点（电梯、楼梯等）并建立跨楼层连接
    const facilityNodesByType = {};
    floors.forEach((floor) => {
      const facilities = facilityData[floor.id] || [];
      facilities.forEach((fac) => {
        const facNode = {
          id: `f_${fac.id}`,
          x: fac.x,
          y: fac.y,
          floorId: floor.id,
          type: 'facility',
          facilityType: fac.type,
        };
        navGraph.nodes.push(facNode);

        // 连接到最近的走廊节点
        let nearestNode = null;
        let minDist = Infinity;
        navGraph.nodes.forEach((node) => {
          if (node.type === 'corridor' && node.floorId === floor.id) {
            const dist = Math.sqrt(
              (facNode.x - node.x) ** 2 + (facNode.y - node.y) ** 2,
            );
            if (dist < minDist) {
              minDist = dist;
              nearestNode = node;
            }
          }
        });

        if (nearestNode) {
          navGraph.edges.push({
            from: facNode.id,
            to: nearestNode.id,
            weight: minDist,
          });
          navGraph.edges.push({
            from: nearestNode.id,
            to: facNode.id,
            weight: minDist,
          });
        }

        // 如果是垂直交通设施，记录以便建立跨楼层连接
        if (['elevator', 'stairs', 'escalator'].includes(fac.type)) {
          const key = `${fac.type}_${Math.round(fac.x)}_${Math.round(fac.y)}`;
          if (!facilityNodesByType[key]) {
            facilityNodesByType[key] = [];
          }
          facilityNodesByType[key].push(facNode);
        }
      });
    });

    // 建立跨楼层连接
    Object.values(facilityNodesByType).forEach((nodes) => {
      if (nodes.length > 1) {
        nodes.forEach((n1, i) => {
          nodes.forEach((n2, j) => {
            if (j <= i) return; // 避免重复和自连接
            const floorIndex1 = floors.findIndex((f) => f.id === n1.floorId);
            const floorIndex2 = floors.findIndex((f) => f.id === n2.floorId);
            // 垂直距离权重更大
            const verticalWeight =
              Math.abs(floorIndex1 - floorIndex2) * SHOP_HEIGHT * 2;
            navGraph.edges.push({
              from: n1.id,
              to: n2.id,
              weight: verticalWeight,
            });
            navGraph.edges.push({
              from: n2.id,
              to: n1.id,
              weight: verticalWeight,
            });
          });
        });
      }
    });
  }

  // ==================== A*算法辅助函数 ====================

  // 启发式函数（欧几里得距离）
  function heuristic(nodeA, nodeB) {
    const dx = nodeA.x - nodeB.x;
    const dy = nodeA.y - nodeB.y;
    const floorIndexA = floors.findIndex((f) => f.id === nodeA.floorId);
    const floorIndexB = floors.findIndex((f) => f.id === nodeB.floorId);
    const dz = (floorIndexA - floorIndexB) * SHOP_HEIGHT;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // 获取邻居节点
  function getNeighbors(nodeId) {
    const neighbors = [];
    navGraph.edges.forEach((edge) => {
      if (edge.from === nodeId) {
        const neighbor = navGraph.nodes.find((n) => n.id === edge.to);
        if (neighbor) neighbors.push(neighbor);
      }
    });
    return neighbors;
  }

  // 获取边权重
  function getEdgeWeight(fromId, toId) {
    const edge = navGraph.edges.find((e) => e.from === fromId && e.to === toId);
    return edge ? edge.weight : Infinity;
  }

  // 重建路径
  function reconstructPath(cameFrom, currentNodeId) {
    const path = [currentNodeId];
    while (cameFrom[currentNodeId]) {
      currentNodeId = cameFrom[currentNodeId];
      path.unshift(currentNodeId);
    }
    return path;
  }

  // A*算法实现
  function aStarSearch(startNodeId, endNodeId) {
    const openSet = [];
    const closedSet = new Set();
    const gScore = {};
    const fScore = {};
    const cameFrom = {};

    const startNode = navGraph.nodes.find((n) => n.id === startNodeId);
    const endNode = navGraph.nodes.find((n) => n.id === endNodeId);

    if (!startNode || !endNode) {
      return null;
    }

    gScore[startNodeId] = 0;
    fScore[startNodeId] = heuristic(startNode, endNode);
    openSet.push({ id: startNodeId, f: fScore[startNodeId] });

    while (openSet.length > 0) {
      // 取出f值最小的节点
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();

      if (current.id === endNodeId) {
        return reconstructPath(cameFrom, current.id);
      }

      closedSet.add(current.id);

      // 获取邻居节点
      const neighbors = getNeighbors(current.id);
      neighbors.forEach((neighbor) => {
        if (closedSet.has(neighbor.id)) return;

        const edgeWeight = getEdgeWeight(current.id, neighbor.id);
        const tentativeG = gScore[current.id] + edgeWeight;

        if (tentativeG < (gScore[neighbor.id] || Infinity)) {
          cameFrom[neighbor.id] = current.id;
          gScore[neighbor.id] = tentativeG;
          fScore[neighbor.id] = tentativeG + heuristic(neighbor, endNode);

          if (!openSet.find((n) => n.id === neighbor.id)) {
            openSet.push({ id: neighbor.id, f: fScore[neighbor.id] });
          }
        }
      });
    }

    return null; // 无路径
  }

  // 查找最近的导航节点
  function findNearestNode(x, y, floorId) {
    let nearestNode = null;
    let minDist = Infinity;

    navGraph.nodes.forEach((node) => {
      if (node.floorId === floorId) {
        const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        if (dist < minDist) {
          minDist = dist;
          nearestNode = node;
        }
      }
    });

    return nearestNode;
  }

  // 根据位置ID获取节点
  // 计算两点间距离
  function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    const floorIndex1 = floors.findIndex((f) => f.id === point1.floorId);
    const floorIndex2 = floors.findIndex((f) => f.id === point2.floorId);
    const dz = (floorIndex1 - floorIndex2) * SHOP_HEIGHT;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function initThreeScene() {
    if (!threeContainerRef.value) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8e8e8);

    const container = threeContainerRef.value;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;

    const mapSize = getMapSize();
    const maxDim = Math.max(mapSize.w, mapSize.h);
    const frustumSize = maxDim * 1.2;

    orthoCamera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      10000,
    );

    const mapCenter = getMapCenter();

    // 2.5D视角：接近正俯视，轻微倾斜
    orthoCamera.position.set(
      mapCenter.x,
      maxDim * 1.2,
      mapCenter.z + maxDim * 0.2,
    );
    orthoCamera.lookAt(mapCenter.x, 0, mapCenter.z);

    perspectiveCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 10000);
    perspectiveCamera.position.set(
      mapCenter.x,
      maxDim * 0.8,
      mapCenter.z + maxDim * 0.4,
    );
    perspectiveCamera.lookAt(mapCenter.x, 0, mapCenter.z);

    // 默认使用3D透视相机
    camera = perspectiveCamera;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.target.set(mapCenter.x, 0, mapCenter.z);
    controls.update();

    raycaster = new THREE.Raycaster();

    // 参考图：浅灰白色背景
    scene.background = new THREE.Color(0xf5f5f7);

    // 参考图：明亮的整体光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0xc8e6c0, 0.5);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(200, 400, 200);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 2000;
    dirLight.shadow.camera.left = -600;
    dirLight.shadow.camera.right = 600;
    dirLight.shadow.camera.top = 600;
    dirLight.shadow.camera.bottom = -600;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0ff, 0.45);
    fillLight.position.set(-200, 200, -200);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xfff5e6, 0.35);
    backLight.position.set(0, 150, -300);
    scene.add(backLight);

    // 地面底板 - 浅灰色（参考图风格）
    const bounds = getMapBounds();
    const pad = 60;
    const groundGeo = new THREE.PlaneGeometry(
      bounds.maxX - bounds.minX + pad * 2,
      bounds.maxY - bounds.minY + pad * 2,
    );
    groundGeo.rotateX(-Math.PI / 2);

    // 参考图：浅灰白色地面/走廊背景
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = 256;
    tileCanvas.height = 256;
    const tileCtx = tileCanvas.getContext('2d');
    tileCtx.fillStyle = '#ffffff';
    tileCtx.fillRect(0, 0, 256, 256);
    // 极淡的网格线
    tileCtx.strokeStyle = 'rgba(240,240,240,0.3)';
    tileCtx.lineWidth = 1;
    const tileSize = 32;
    for (let tx = 0; tx < 256; tx += tileSize) {
      for (let ty = 0; ty < 256; ty += tileSize) {
        tileCtx.strokeRect(tx, ty, tileSize, tileSize);
      }
    }
    const tileTexture = new THREE.CanvasTexture(tileCanvas);
    tileTexture.wrapS = THREE.RepeatWrapping;
    tileTexture.wrapT = THREE.RepeatWrapping;
    tileTexture.repeat.set(
      (bounds.maxX - bounds.minX + pad * 2) / 128,
      (bounds.maxY - bounds.minY + pad * 2) / 128,
    );

    const groundMat = new THREE.MeshLambertMaterial({
      map: tileTexture,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(
      (bounds.minX + bounds.maxX) / 2,
      0,
      (bounds.minY + bounds.maxY) / 2,
    );
    ground.receiveShadow = true;
    scene.add(ground);

    buildFloorGroups();

    // 构建导航图
    buildNavGraph();
  }

  // ==================== 导航动画和控制函数 ====================

  // 创建3D导航标记
  function createNavMarker() {
    const geometry = new THREE.ConeGeometry(3, 8, 8);
    const material = new THREE.MeshLambertMaterial({
      color: 0x1890ff,
      emissive: 0x1890ff,
      emissiveIntensity: 0.3,
    });
    navMarker = new THREE.Mesh(geometry, material);
    navMarker.rotation.x = Math.PI / 2;
    scene.add(navMarker);
  }

  // 更新导航动画
  function updateNavigation(deltaTime) {
    if (!navigationState.value.active || navigationState.value.paused) return;

    const points = routePoints.value;
    if (points.length < 2) return;

    const state = navigationState.value;
    const speed = 50 * state.speed;

    const currentIdx = state.currentIndex;
    const nextIdx = currentIdx + 1;

    if (nextIdx >= points.length) {
      stopNavigation();
      Message.success('已到达目的地');
      return;
    }

    const currentPoint = points[currentIdx];
    const nextPoint = points[nextIdx];

    const segmentDist = calculateDistance(currentPoint, nextPoint);

    state.progress += (speed * deltaTime) / segmentDist;

    if (state.progress >= 1) {
      state.currentIndex++;
      state.progress = 0;
      state.traveledDistance += segmentDist;
      state.remainingDistance -= segmentDist;
      updateRouteHighlight();
      checkFloorChange();
      return;
    }

    const t = state.progress;
    const x = currentPoint.x + (nextPoint.x - currentPoint.x) * t;
    const y = currentPoint.y + (nextPoint.y - currentPoint.y) * t;

    let z = 0;
    {
      const floorIndex = floors.findIndex((f) => f.id === currentPoint.floorId);
      z = floorIndex * SHOP_HEIGHT + SHOP_HEIGHT * 0.4 + 0.5;
    }

    if (navMarker) {
      navMarker.position.set(x, z, y);

      const direction = new THREE.Vector3(
        nextPoint.x - x,
        0,
        nextPoint.y - y,
      ).normalize();
      const angle = Math.atan2(direction.x, direction.z);
      navMarker.rotation.z = -angle;
    }

    updateRouteHighlight();
  }

  // 初始化导航
  function initNavigation() {
    if (routePoints.value.length < 2) return;

    let totalDist = 0;
    for (let i = 0; i < routePoints.value.length - 1; i++) {
      totalDist += calculateDistance(
        routePoints.value[i],
        routePoints.value[i + 1],
      );
    }

    navigationState.value = {
      active: true,
      paused: false,
      speed: 1.0,
      currentIndex: 0,
      progress: 0,
      totalDistance: totalDist,
      traveledDistance: 0,
      remainingDistance: totalDist,
    };

    createNavMarker();
    focusOnStartPoint();
    Message.success('导航已开始');
  }

  // 暂停/继续导航
  function togglePause() {
    navigationState.value.paused = !navigationState.value.paused;
    Message.info(navigationState.value.paused ? '导航已暂停' : '导航继续');
  }

  // 停止导航
  function stopNavigation() {
    navigationState.value.active = false;

    if (navMarker) {
      scene.remove(navMarker);
      navMarker.geometry.dispose();
      navMarker.material.dispose();
      navMarker = null;
    }

    Message.info('导航已结束');
  }

  // 更新路径高亮
  function updateRouteHighlight() {
    const completedIndex = navigationState.value.currentIndex;

    routeSegments.forEach((segment, idx) => {
      if (idx < completedIndex) {
        segment.material.color.setHex(0x52c41a);
        segment.material.opacity = 0.5;
      } else if (idx === completedIndex) {
        segment.material.color.setHex(0xfaad14);
        segment.material.opacity = 0.9;
      } else {
        segment.material.color.setHex(0x1890ff);
        segment.material.opacity = 0.8;
      }
    });
  }

  // 检查楼层变化
  function checkFloorChange() {
    const currentIdx = navigationState.value.currentIndex;
    const nextIdx = currentIdx + 1;

    if (nextIdx >= routePoints.value.length) return;

    const currentFloorId = routePoints.value[currentIdx].floorId;
    const nextFloorId = routePoints.value[nextIdx].floorId;

    if (currentFloorId !== nextFloorId) {
      const floor = floors.find((f) => f.id === nextFloorId);
      Message.info(`即将到达 ${floor?.label}，请准备换乘`);

      setTimeout(() => {
        selectFloor(nextFloorId);
      }, 2000);
    }
  }

  // 聚焦到起点
  function focusOnStartPoint() {
    if (routePoints.value.length === 0) return;

    const start = routePoints.value[0];
    const floorIndex = floors.findIndex((f) => f.id === start.floorId);

    controls.target.set(start.x, floorIndex * SHOP_HEIGHT, start.y);
    controls.update();

    // 延迟调用selectFloor以避免函数提升问题
    setTimeout(() => {
      selectFloor(start.floorId);
    }, 100);
  }

  // 格式化距离
  function formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)}米`;
    }
    return `${(meters / 1000).toFixed(1)}公里`;
  }

  // 格式化时间
  function formatTime(seconds) {
    if (seconds < 60) {
      return `${Math.round(seconds)}秒`;
    }
    const minutes = Math.ceil(seconds / 60);
    return `${minutes}分钟`;
  }

  // 计算预计到达时间
  function calculateETA() {
    const speed = 1.4;
    return (
      navigationState.value.remainingDistance /
      (speed * navigationState.value.speed)
    );
  }

  // 获取进度百分比
  function getProgressPercent() {
    if (navigationState.value.totalDistance === 0) return 0;
    return Math.round(
      (navigationState.value.traveledDistance /
        navigationState.value.totalDistance) *
        100,
    );
  }

  // 获取当前楼层标签
  function getCurrentFloorLabel() {
    const currentIdx = navigationState.value.currentIndex;
    const point = routePoints.value[currentIdx];
    if (!point) return currentFloorLabel.value;
    const floor = floors.find((f) => f.id === point.floorId);
    return floor ? floor.label : currentFloorLabel.value;
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    if (controls) controls.update();
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }

    // 更新导航动画
    updateNavigation(deltaTime);

    if (camera) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const angle = Math.atan2(dir.x, -dir.z) * (180 / Math.PI);
      compassAngle.value = Math.round(angle);
    }
  }

  function resetCompass() {
    const mapCenter = getMapCenter();
    const mapSize = getMapSize();
    const maxDim = Math.max(mapSize.w, mapSize.h);
    if (is3D.value) {
      camera.position.set(
        mapCenter.x,
        maxDim * 0.8,
        mapCenter.z + maxDim * 0.4,
      );
    } else {
      camera.position.set(
        mapCenter.x,
        maxDim * 1.2,
        mapCenter.z + maxDim * 0.2,
      );
    }
    camera.lookAt(mapCenter.x, 0, mapCenter.z);
    controls.target.set(mapCenter.x, 0, mapCenter.z);
    controls.update();
  }

  function onCompassMouseMove(e) {
    if (!compassDragging.value) return;
    const compassEl = document.querySelector('.compass-ring');
    if (!compassEl) return;
    const rect = compassEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const targetAngle = Math.atan2(dx, -dy) * (180 / Math.PI);
    const currentAngle = compassAngle.value;
    let rawDelta = targetAngle - currentAngle;
    if (rawDelta > 180) rawDelta -= 360;
    if (rawDelta < -180) rawDelta += 360;
    const delta = rawDelta * 0.3;

    const mapCenter = getMapCenter();
    const pos = camera.position
      .clone()
      .sub(new THREE.Vector3(mapCenter.x, 0, mapCenter.z));
    const rad = delta * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const newX = pos.x * cos - pos.z * sin;
    const newZ = pos.x * sin + pos.z * cos;
    camera.position.set(mapCenter.x + newX, pos.y, mapCenter.z + newZ);
    controls.target.set(mapCenter.x, 0, mapCenter.z);
    controls.update();
  }

  function onCompassMouseUp() {
    compassDragging.value = false;
    document.removeEventListener('mousemove', onCompassMouseMove);
    document.removeEventListener('mouseup', onCompassMouseUp);
  }

  function onCompassMouseDown(e) {
    e.preventDefault();
    compassDragging.value = true;
    document.addEventListener('mousemove', onCompassMouseMove);
    document.addEventListener('mouseup', onCompassMouseUp);
  }

  function clearRoute() {
    if (routeLine) {
      scene.remove(routeLine);
      routeLine.geometry.dispose();
      routeLine.material.dispose();
      routeLine = null;
    }
    if (routeMarker) {
      scene.remove(routeMarker);
      routeMarker.geometry.dispose();
      routeMarker.material.dispose();
      routeMarker = null;
    }
    // 清理路径段
    routeSegments.forEach((segment) => {
      scene.remove(segment);
      segment.geometry.dispose();
      segment.material.dispose();
    });
    routeSegments = [];
  }

  function selectFloor(floorId) {
    currentFloor.value = floorId;
    popupInfo.value = null;

    // 导航中切换楼层时不清理路径（用于跨楼层导航自动切层）
    if (!navigationState.value.active) {
      routePoints.value = [];
      clearRoute();
    }

    floors.forEach((floor) => {
      const group = floorGroups[floor.id];
      if (group) {
        group.visible = floor.id === floorId;
      }
    });
  }

  function goUpFloor() {
    const idx = floors.findIndex((f) => f.id === currentFloor.value);
    if (idx > 0) selectFloor(floors[idx - 1].id);
  }

  function goDownFloor() {
    const idx = floors.findIndex((f) => f.id === currentFloor.value);
    if (idx < floors.length - 1) selectFloor(floors[idx + 1].id);
  }

  function toggle3D() {
    is3D.value = !is3D.value;
    const mapCenter = getMapCenter();
    const mapSize = getMapSize();
    const maxDim = Math.max(mapSize.w, mapSize.h);

    if (is3D.value) {
      camera = perspectiveCamera;
      camera.position.set(
        mapCenter.x,
        maxDim * 0.8,
        mapCenter.z + maxDim * 0.4,
      );
      camera.lookAt(mapCenter.x, 0, mapCenter.z);
      if (controls) {
        controls.dispose();
      }
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.screenSpacePanning = true;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      controls.target.set(mapCenter.x, 0, mapCenter.z);
      controls.update();
      Message.success('已切换到 3D 视图');
    } else {
      camera = orthoCamera;
      camera.position.set(
        mapCenter.x,
        maxDim * 1.2,
        mapCenter.z + maxDim * 0.2,
      );
      camera.lookAt(mapCenter.x, 0, mapCenter.z);
      if (controls) {
        controls.dispose();
      }
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.screenSpacePanning = true;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      controls.target.set(mapCenter.x, 0, mapCenter.z);
      controls.update();
      Message.success('已切换到 2D 视图');
    }
  }

  function resetView() {
    const mapCenter = getMapCenter();
    const mapSize = getMapSize();
    const maxDim = Math.max(mapSize.w, mapSize.h);

    if (is3D.value) {
      camera.position.set(
        mapCenter.x,
        maxDim * 0.8,
        mapCenter.z + maxDim * 0.4,
      );
    } else {
      camera.position.set(
        mapCenter.x,
        maxDim * 1.2,
        mapCenter.z + maxDim * 0.2,
      );
    }
    controls.target.set(mapCenter.x, 0, mapCenter.z);
    controls.update();

    routePoints.value = [];
    clearRoute();
  }

  function zoomIn() {
    if (!camera || !controls) return;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, 50);
    controls.update();
  }

  function zoomOut() {
    if (!camera || !controls) return;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, -50);
    controls.update();
  }

  function rotateStep(angleDelta) {
    const mapCenter = getMapCenter();
    const pos = camera.position
      .clone()
      .sub(new THREE.Vector3(mapCenter.x, 0, mapCenter.z));
    const rad = angleDelta * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const newX = pos.x * cos - pos.z * sin;
    const newZ = pos.x * sin + pos.z * cos;
    camera.position.set(mapCenter.x + newX, pos.y, mapCenter.z + newZ);
    controls.target.set(mapCenter.x, 0, mapCenter.z);
    controls.update();
  }

  function rotateLeft() {
    rotateStep(-45);
  }

  function rotateRight() {
    rotateStep(45);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.value?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function onFullscreenChange() {
    isFullscreen.value = !!document.fullscreenElement;
  }

  function enableGyro() {
    gyroEnabled.value = true;
    gyroHandler = (event) => {
      // alpha: 绕 z 轴旋转（0-360）
      // beta: 绕 x 轴旋转（-180 到 180）
      // gamma: 绕 y 轴旋转（-90 到 90）
      const { alpha } = event; // 设备朝向
      if (alpha !== null) {
        const mapCenter = getMapCenter();
        const targetAngle = alpha;
        const currentAngle = compassAngle.value;
        let delta = targetAngle - currentAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        const pos = camera.position
          .clone()
          .sub(new THREE.Vector3(mapCenter.x, 0, mapCenter.z));
        const rad = (delta * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const newX = pos.x * cos - pos.z * sin;
        const newZ = pos.x * sin + pos.z * cos;
        camera.position.set(mapCenter.x + newX, pos.y, mapCenter.z + newZ);
        controls.target.set(mapCenter.x, 0, mapCenter.z);
        controls.update();
      }
    };
    window.addEventListener('deviceorientation', gyroHandler);
    Message.success('已开启陀螺仪，移动设备可旋转地图');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function toggleGyro() {
    if (!window.DeviceOrientationEvent) {
      Message.warning('您的设备不支持陀螺仪');
      return;
    }

    if (gyroEnabled.value) {
      // 关闭陀螺仪
      gyroEnabled.value = false;
      if (gyroHandler) {
        window.removeEventListener('deviceorientation', gyroHandler);
        gyroHandler = null;
      }
      Message.success('已关闭陀螺仪');
      return;
    }

    // 请求权限（iOS 13+ 需要）
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            enableGyro();
          } else {
            Message.warning('需要陀螺仪权限才能使用此功能');
          }
        })
        .catch(() => {
          Message.error('无法获取陀螺仪权限');
        });
    } else {
      enableGyro();
    }
  }

  function createRoute3D(points) {
    clearRoute();
    if (points.length < 2) return;

    routeSegments = [];

    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];

      const floorIndex = floors.findIndex((f) => f.id === start.floorId);
      // 路线放在房间顶面之上 0.5 单位，深度测试保证在房间上方可见
      const baseY = floorIndex * SHOP_HEIGHT + SHOP_HEIGHT * 0.4 + 0.5;

      const vertices = [
        new THREE.Vector3(start.x, baseY, start.y),
        new THREE.Vector3(end.x, baseY, end.y),
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
      const material = new THREE.LineBasicMaterial({
        color: 0x1890ff,
        linewidth: 3,
        transparent: true,
        opacity: 0.9,
      });

      const segment = new THREE.Line(geometry, material);
      segment.userData = { index: i, completed: false };
      scene.add(segment);
      routeSegments.push(segment);
    }

    // 创建终点标记
    const lastPoint = points[points.length - 1];
    const markerGeo = new THREE.SphereGeometry(4, 16, 16);
    const markerMat = new THREE.MeshLambertMaterial({ color: 0xff4d4f });
    routeMarker = new THREE.Mesh(markerGeo, markerMat);
    const floorIndex = floors.findIndex((f) => f.id === lastPoint.floorId);
    routeMarker.position.set(
      lastPoint.x,
      floorIndex * SHOP_HEIGHT + SHOP_HEIGHT * 0.4 + 1,
      lastPoint.y,
    );
    scene.add(routeMarker);
  }

  function handleSearch() {
    if (!searchText.value) return;
    const kw = searchText.value.toLowerCase();
    const found = allLocations.value.find((loc) =>
      loc.name.toLowerCase().includes(kw),
    );
    if (found) {
      controls.target.set(found.x, 0, found.y);
      controls.update();
      Message.success(`找到: ${found.name}`);
    } else {
      Message.warning('未找到相关位置');
    }
  }

  function locateFacility(type) {
    const fac = currentFacilities.value.find((f) => f.type === type);
    if (fac) {
      controls.target.set(fac.x, 0, fac.y);
      controls.update();
    }
  }

  function navigateTo(info) {
    const shop = currentShops.value.find((s) => s.id === info.id);
    if (!shop) return;

    const endX = shop.x + shop.w / 2;
    const endY = shop.y + shop.h / 2;
    const floorId = currentFloor.value;

    // 使用相机当前聚焦位置作为起点
    const cameraTarget = controls ? controls.target : null;
    const startX = cameraTarget ? cameraTarget.x : getMapCenter().x;
    const startY = cameraTarget ? cameraTarget.z : getMapCenter().z;

    const startNode = findNearestNode(startX, startY, floorId);
    const endNode = findNearestNode(endX, endY, floorId);

    if (!startNode || !endNode) {
      Message.warning('无法计算路径，请使用路线规划面板选择起终点');
      return;
    }

    // 执行 A* 搜索
    const pathNodeIds = aStarSearch(startNode.id, endNode.id);
    if (!pathNodeIds || pathNodeIds.length === 0) {
      Message.warning('无法找到可行路径');
      return;
    }

    // 转换为 3D 坐标点
    routePoints.value = pathNodeIds.map((nodeId) => {
      const node = navGraph.nodes.find((n) => n.id === nodeId);
      return { x: node.x, y: node.y, floorId: node.floorId };
    });

    // 绘制 3D 路径并启动导航
    createRoute3D(routePoints.value);
    popupInfo.value = null;
    initNavigation();
    Message.success(`导航到: ${info.name}`);
  }

  function confirmRoute() {
    if (!routeForm.value.start || !routeForm.value.end) {
      Message.warning('请选择起点和终点');
      return;
    }

    const start = allLocations.value.find(
      (l) => l.id === routeForm.value.start,
    );
    const end = allLocations.value.find((l) => l.id === routeForm.value.end);

    if (start && end) {
      // 获取起点和终点的导航节点
      const startNode = findNearestNode(start.x, start.y, currentFloor.value);
      const endNode = findNearestNode(end.x, end.y, currentFloor.value);

      if (!startNode || !endNode) {
        Message.error('无法找到起点或终点的导航节点');
        return;
      }

      // 执行 A* 搜索
      const pathNodeIds = aStarSearch(startNode.id, endNode.id);

      if (!pathNodeIds || pathNodeIds.length === 0) {
        Message.error('无法找到可行路径');
        return;
      }

      // 转换为3D坐标点
      routePoints.value = pathNodeIds.map((nodeId) => {
        const node = navGraph.nodes.find((n) => n.id === nodeId);
        return {
          x: node.x,
          y: node.y,
          floorId: node.floorId,
        };
      });

      // 绘制3D路径
      createRoute3D(routePoints.value);

      // 初始化导航状态
      initNavigation();

      Message.success(`路线: ${start.name} → ${end.name}`);
    }
    routeModalVisible.value = false;
  }

  function cancelRoute() {
    routeModalVisible.value = false;
    routeForm.value = { start: null, end: null };
  }

  function handleCanvasClick(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );

    raycaster.setFromCamera(mouse, camera);
    const currentGroup = floorGroups[currentFloor.value];
    const targets = currentGroup
      ? currentGroup.children.reduce((acc, child) => {
          if (child.isGroup) {
            child.children.forEach((c) => {
              if (c.userData && c.userData.category) acc.push(c);
            });
          }
          return acc;
        }, [])
      : [];

    const intersects = raycaster.intersectObjects(targets, false);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      const data = obj.userData;

      if (data.category === 'shop') {
        popupInfo.value = {
          id: data.id,
          name: data.name,
          typeLabel: getTypeLabel(data.type),
          description: '',
        };
        popupStyle.value = {
          left: `${e.clientX - rect.left + 10}px`,
          top: `${e.clientY - rect.top - 60}px`,
        };
        return;
      }

      if (data.category === 'facility') {
        popupInfo.value = {
          id: data.id,
          name: data.name,
          typeLabel: facilityIcons[data.type]?.label || data.type,
          description: '',
        };
        popupStyle.value = {
          left: `${e.clientX - rect.left + 10}px`,
          top: `${e.clientY - rect.top - 60}px`,
        };
        return;
      }
    }

    popupInfo.value = null;
  }

  function resizeRenderer() {
    if (!threeContainerRef.value || !renderer) return;
    const container = threeContainerRef.value;
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);

    const aspect = width / height;
    if (camera === orthoCamera) {
      const mapSize = getMapSize();
      const maxDim = Math.max(mapSize.w, mapSize.h);
      const frustumSize = maxDim * 1.2;
      orthoCamera.left = (-frustumSize * aspect) / 2;
      orthoCamera.right = (frustumSize * aspect) / 2;
      orthoCamera.top = frustumSize / 2;
      orthoCamera.bottom = -frustumSize / 2;
      orthoCamera.updateProjectionMatrix();
    } else if (camera === perspectiveCamera) {
      perspectiveCamera.aspect = aspect;
      perspectiveCamera.updateProjectionMatrix();
    }
  }

  onMounted(() => {
    nextTick(() => {
      initThreeScene();
      animate();
    });
    window.addEventListener('resize', resizeRenderer);
    document.addEventListener('fullscreenchange', onFullscreenChange);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resizeRenderer);
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (controls) controls.dispose();
    if (renderer) {
      renderer.dispose();
      if (threeContainerRef.value && renderer.domElement.parentNode) {
        threeContainerRef.value.removeChild(renderer.domElement);
      }
    }
    if (scene) {
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }
  });
</script>

<style scoped>
  .indoor-map-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #e8e8e8;
  }

  .map-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-label {
    font-size: 16px;
    color: #ff6b35;
    font-weight: bold;
  }

  .header-title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }

  .floor-panel {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .floor-panel-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    font-size: 13px;
    color: #666;
    border-bottom: 1px solid #f0f0f0;
  }

  .floor-panel-arrow-up,
  .floor-panel-arrow-down {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    cursor: pointer;
    color: #999;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
  }

  .floor-panel-arrow-up:hover,
  .floor-panel-arrow-down:hover {
    background: #f5f5f5;
    color: #333;
  }

  .floor-panel-item {
    padding: 10px 16px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    color: #666;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.2s;
  }

  .floor-panel-item:hover {
    background: #f5f5f5;
  }

  .floor-panel-item.active {
    background: #ff6b35;
    color: #fff;
  }

  .bottom-controls {
    position: absolute;
    bottom: 16px;
    left: 16px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .control-hints {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }

  .control-hints span {
    font-size: 11px;
    color: #999;
    background: rgba(255, 255, 255, 0.8);
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* 右侧控制面板 - 参考百度/高德地图 */
  .map-controls {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .compass {
    cursor: pointer;
    user-select: none;
  }

  .compass-ring {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .compass-needle {
    transition: transform 0.3s ease;
  }

  /* 通用控制按钮：3D、定位、全屏 */
  .ctrl-btn {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #333;
    user-select: none;
    transition: background 0.2s;
  }

  .ctrl-btn:hover {
    background: #f0f0f0;
  }

  .ctrl-btn-text {
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
  }

  .ctrl-btn-label {
    font-size: 9px;
    margin-top: 2px;
    line-height: 1;
  }

  .zoom-controls {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  .zoom-btn {
    width: 40px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #333;
    transition: background 0.2s;
  }

  .zoom-btn:first-child {
    border-bottom: 1px solid #e8e8e8;
  }

  .zoom-btn:hover {
    background: #f5f5f5;
  }

  .scale-bar {
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .scale-line {
    width: 80px;
    height: 3px;
    background: #333;
    position: relative;
  }

  .scale-line::before,
  .scale-line::after {
    content: '';
    position: absolute;
    top: 0;
    width: 3px;
    height: 8px;
    background: #333;
  }

  .scale-line::before {
    left: 0;
  }

  .scale-line::after {
    right: 0;
  }

  .scale-text {
    font-size: 12px;
    color: #666;
    font-weight: 500;
  }

  .facility-bar {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    gap: 10px;
  }

  .fac-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
    gap: 2px;
  }

  .fac-btn:hover {
    transform: scale(1.08);
  }

  .search-box {
    position: absolute;
    top: 16px;
    left: 80px;
    z-index: 10;
    width: 260px;
  }

  .three-container {
    width: 100%;
    height: 100%;
    display: block;
  }

  .info-popup {
    position: absolute;
    z-index: 20;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    padding: 12px 16px;
    min-width: 160px;
  }

  .popup-title {
    font-size: 15px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }

  .popup-type {
    font-size: 12px;
    color: #999;
    margin-bottom: 6px;
  }

  .popup-desc {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }

  /* 导航信息面板样式 */
  .navigation-panel {
    position: absolute;
    top: 80px;
    right: 16px;
    width: 280px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    padding: 16px;
    z-index: 20;
  }

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }

  .nav-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .nav-info {
    margin-bottom: 12px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
  }

  .info-row .label {
    color: #666;
  }

  .info-row .value {
    color: #333;
    font-weight: 500;
  }

  .nav-progress {
    margin-bottom: 12px;
  }

  .nav-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .speed-control {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #666;
  }
</style>
