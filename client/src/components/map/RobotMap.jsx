import { useEffect, useRef } from "react";
import "ol/ol.css";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";
import { defaults as defaultControls } from "ol/control";
import { useRobots } from "../../hooks/useRobots";
function RobotMap() {
  const { robots, selectedRobot, isLoading } = useRobots();
  const selectedRobotId = selectedRobot?.id;
  const selectedRobotLon = selectedRobot?.lon;
  const selectedRobotLat = selectedRobot?.lat;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const robotLayerRef = useRef(null);
  const hasAutoFittedRef = useRef(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const robotSource = new VectorSource();

    const robotLayer = new VectorLayer({
      source: robotSource,
      style: (feature) => {
        const name = feature.get("name") || "";

        return new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: "#2563eb" }),
            stroke: new Stroke({ color: "#ffffff", width: 2 }),
          }),
          text: new Text({
            text: name,
            offsetY: -18,
            font: "12px sans-serif",
            fill: new Fill({ color: "#111827" }),
            stroke: new Stroke({ color: "#ffffff", width: 3 }),
          }),
        });
      },
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        robotLayer,
      ],
      view: new View({
        center: fromLonLat([10, 51]),
        zoom: 6,
      }),
      controls: defaultControls(),
    });

    mapInstanceRef.current = map;
    robotLayerRef.current = robotLayer;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
      robotLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const robotLayer = robotLayerRef.current;

    if (!map || !robotLayer) return;

    const source = robotLayer.getSource();
    source.clear();

    const validRobots = robots.filter(
      (robot) =>
        robot &&
        typeof robot.lon === "number" &&
        typeof robot.lat === "number"
    );

    const features = validRobots.map((robot) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([robot.lon, robot.lat])),
        robotId: robot.id,
        name: robot.name || String(robot.id),
      });

      return feature;
    });

    source.addFeatures(features);

    // Auto-fit only once, so websocket updates do not keep resetting zoom
    if (hasAutoFittedRef.current || features.length === 0) {
      return;
    }

    const view = map.getView();

    if (features.length === 1) {
      view.setCenter(features[0].getGeometry().getCoordinates());
      view.setZoom(14);
    } else {
      view.fit(source.getExtent(), {
        padding: [50, 50, 50, 50],
        maxZoom: 16,
      });
    }

    hasAutoFittedRef.current = true;
  }, [robots]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || selectedRobotId == null) return;

    if (
      typeof selectedRobotLon !== "number" ||
      typeof selectedRobotLat !== "number"
    ) {
      return;
    }

    const view = map.getView();
    const targetCenter = fromLonLat([selectedRobotLon, selectedRobotLat]);
    const currentZoom = view.getZoom() ?? 10;
    const zoomOutLevel = Math.min(currentZoom, 8);

    view.animate(
      { zoom: zoomOutLevel, duration: 400 },
      { center: targetCenter, duration: 400 },
      { zoom: 14, duration: 1000 }
    );
  }, [selectedRobotId, selectedRobotLon, selectedRobotLat]);

  function recenterToRobots() {
    const map = mapInstanceRef.current;
    const robotLayer = robotLayerRef.current;

    if (!map || !robotLayer) return;

    const source = robotLayer.getSource();
    const features = source.getFeatures();

    if (!features.length) return;

    const view = map.getView();

    if (features.length === 1) {
      view.animate({
        center: features[0].getGeometry().getCoordinates(),
        zoom: 14,
        duration: 400,
      });
    } else {
      view.fit(source.getExtent(), {
        padding: [50, 50, 50, 50],
        duration: 400,
        maxZoom: 16,
      });
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/30 backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Live Map</h2>
        <div className="flex items-center gap-3 text-xs text-slate-300 sm:text-sm">
          {isLoading ? (
            <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1">
              Loading...
            </span>
          ) : (
            <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1">
              {robots.length} robots
            </span>
          )}
          <button
            type="button"
            onClick={recenterToRobots}
            className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 font-medium text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Recenter
          </button>
        </div>
      </div>

      <div
        ref={mapRef}
        className="h-[340px] w-full rounded-xl border border-slate-700 sm:h-[420px]"
      />
    </section>
  );
}

export { RobotMap };