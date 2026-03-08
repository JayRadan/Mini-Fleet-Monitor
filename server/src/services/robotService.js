// STEP 1: Implement getAllRobots() query.
// STEP 2: Add Redis cache for GET /robots (TTL 10s).
// STEP 3: Implement moveRobotById(id) with random lat/lon offset.
// STEP 4: Update robot status and updated_at.
// STEP 5: Implement moveAllRobots() for simulation timer.
// STEP 6: Invalidate robots cache after updates.
import redis from "../config/redis.js";
import prisma from "../config/prisma.js";

const ROBOTS_CACHE_KEY = "robots:all";
const ROBOTS_CACHE_TTL_SECONDS = 10;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

async function getAllRobots() {
  const cached = await redis.get(ROBOTS_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const rows = await prisma.robot.findMany({
    orderBy: { id: "asc" },
  });

  await redis.set(
    ROBOTS_CACHE_KEY,
    JSON.stringify(rows),
    "EX",
    ROBOTS_CACHE_TTL_SECONDS
  );

  return rows;
}

async function moveRobotById(id, { x, y } = {}) {
  const robotId = Number(id);
  if (!Number.isInteger(robotId) || robotId <= 0) {
    return null;
  }

  const robot = await prisma.robot.findUnique({ where: { id: robotId } });
  if (!robot) {
    return null;
  }

  const providedX = Number(x);
  const providedY = Number(y);
  const hasProvidedCoords =
    Number.isFinite(providedX) && Number.isFinite(providedY);

  const latOffset = (Math.random() - 0.5) * 0.001;
  const lonOffset = (Math.random() - 0.5) * 0.001;

  // If client sends map coords, use them; otherwise simulate a random step.
  const nextLat = hasProvidedCoords
    ? clamp(providedY, -90, 90)
    : clamp(Number(robot.lat) + latOffset, -90, 90);
  const nextLon = hasProvidedCoords
    ? clamp(providedX, -180, 180)
    : clamp(Number(robot.lon) + lonOffset, -180, 180);

  const updated = await prisma.robot.update({
    where: { id: robotId },
    data: {
      lat: nextLat,
      lon: nextLon,
      status: "moving",
      updatedAt: new Date(),
    },
  });

  await redis.del(ROBOTS_CACHE_KEY);
  return updated;
}

async function moveAllRobotsWithStatusMoving() {
  const robots = await prisma.robot.findMany({
    where: { status: "moving" },
  });
  const rows = await Promise.all(
    robots.map(async (robot) => {
      const latOffset = (Math.random() - 0.5) * 0.001;
      const lonOffset = (Math.random() - 0.5) * 0.001;

      return prisma.robot.update({
        where: { id: robot.id },
        data: {
          lat: clamp(Number(robot.lat) + latOffset, -90, 90),
          lon: clamp(Number(robot.lon) + lonOffset, -180, 180),
          status: "moving",
          updatedAt: new Date(),
        },
      });
    })
  );

  await redis.del(ROBOTS_CACHE_KEY);
  return rows;
}

const changeRobotStatusById = async (id, status) => {
  const robotId = Number(id);
  if (!Number.isInteger(robotId) || robotId <= 0) {
    return null;
  }

  const robot = await prisma.robot.findUnique({ where: { id: robotId } });
  if (!robot) {
    return null;
  }

  const updated = await prisma.robot.update({
    where: { id: robotId },
    data: {
      status,
      updatedAt: new Date(),
    },
  });

  await redis.del(ROBOTS_CACHE_KEY);
  return updated;
};

export { getAllRobots, moveRobotById, moveAllRobotsWithStatusMoving, changeRobotStatusById };


